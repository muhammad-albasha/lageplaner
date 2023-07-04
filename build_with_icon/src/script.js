    var map = L.map('map', {
      minZoom: 1,
      maxZoom: 2,
      center: [0, 0],
      zoom: 1,
      crs: L.CRS.Simple
    });

    var w = 250;
    var h = 170;

    map.setMaxBounds([[-h, -w], [h, w]]);
    L.imageOverlay('./Assets/lageplan.jpg', [[-h, -w], [h, w]]).addTo(map);

    var myIcon = L.icon({
      iconUrl: './Assets/marker.png',
      iconSize: [40, 40],
      iconAnchor: [25, 41],
      popupAnchor: [-4, -30],
      shadowUrl: './Assets/marker-shadow.png',
      shadowSize: [40, 41],
      shadowAnchor: [16, 44]
    });

    var hoverIcon = L.icon({
      iconUrl: './Assets/hoverMarker.png',
      iconSize: [40, 40],
      iconAnchor: [25, 41],
      popupAnchor: [-4, -30],
      shadowUrl: './Assets/marker-shadow.png',
      shadowSize: [40, 41],
      shadowAnchor: [16, 44]
    });

    fetch('./Assets/lageplan.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            var marker = L.marker(latlng, {icon: myIcon});

            marker.on('mouseover', function () {
              this.setIcon(hoverIcon);
            });
            marker.on('mouseout', function () {
              this.setIcon(myIcon);
            });

            return marker;
          }
        }).addTo(map)
        .bindPopup(function (layer) {
          return `<a href="` + layer.feature.properties.url + `" target="_blank">` + layer.feature.properties.name + `</a>` + `<p>` + layer.feature.properties.desc + `</p>`;
        });
      })
      .catch(function (error) {
        console.error('Error:', error);
      });