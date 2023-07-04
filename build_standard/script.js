    var map = L.map('map', {
      minZoom: 1,
      maxZoom: 3,
      center: [0, 0],
      zoom: 1,
      crs: L.CRS.Simple
    });
    var w = 250;
    var h = 170;
    map.setMaxBounds([[-h, -w], [h, w]]);
    L.imageOverlay('lageplan.jpg', [[-h, -w], [h, w]]).addTo(map);

    fetch('lageplan.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        L.geoJSON(data).addTo(map)
          .bindPopup(function (layer) {
            return `<a href="` + layer.feature.properties.url + `" target="_blank">` + layer.feature.properties.name + `</a>` + `<p>` + layer.feature.properties.desc + `</p>`;
          });
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
