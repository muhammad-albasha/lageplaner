const {app, BrowserWindow, Menu, Tray, nativeImage, dialog, shell} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const iconPath = path.join(__dirname, "./src/assets/icon.png");

function createWindow() {
  const win = new BrowserWindow({
    icon: iconPath,
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    show: false,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
	function handleRedirect(e, url) {
		e.preventDefault();
		if (url !== win.webContents.getURL()) {
			shell.openExternal(url);
		}
	}
	win.webContents.on('new-window', handleRedirect);
  win.loadFile("index.html");
  const tray = new Tray(nativeImage.createFromPath(iconPath));
  const contextMenu = Menu.buildFromTemplate([{ role: "quit", label: "Quit" }]);
  tray.setToolTip("LagePlaner"), tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  var splash = new BrowserWindow({
    icon: iconPath,
    width: 520,
    height: 310,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile("splash.html");
  splash.center();
  setTimeout(function () {
    splash.close();
    win.center();
    win.show();
  }, 3000);
  win.on("close", (event) => {
    event.preventDefault();
    let options = {};
    options.type = "question";
    options.buttons = ["Close", "Cancel", "Minimize"];
    options.defaultId = 1;
    options.title = "LagePlaner App";
    options.message = "do you want to close the app?";
    options.noLink = true;
    options.normalizeAccessKeys = false;

    dialog
      .showMessageBox(win, options)
      .then((choice) => {
        if (choice.response == 0) {
          win.destroy();
        } else if (choice.response == 2) {
          win.hide();
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  });
  autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Ok"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "new version is available. Downloading now...",
    };
    dialog.showMessageBox(dialogOpts);
  });
  autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: [ "Update Lager planer now" , "Later"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "A new version has been downloaded. Restart the application to apply the updates.",
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow(),
  setTimeout(function () {
    autoUpdater.checkForUpdates();
  }, 10000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
