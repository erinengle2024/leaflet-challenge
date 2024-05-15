// Fetch earthquake data from USGS
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function(data) {
    // Create Leaflet map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

    // Function to determine color based on depth
    function getColor(d) {
        return d > 100 ? '#800026' :
               d > 70  ? '#BD0026' :
               d > 50  ? '#E31A1C' :
               d > 30  ? '#FC4E2A' :
               d > 10  ? '#FD8D3C' :
                         '#FFEDA0';
    }

    // Function to create legend
    function createLegend() {
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 30, 50, 70, 100];
            div.innerHTML += '<b>Depth (km)</b><br>';
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    (depths[i + 1] ? depths[i] + '&ndash;' + depths[i + 1] + '<br>' : depths[i] + '+');
            }
            return div;
        };
        legend.addTo(myMap);
    }
       

    // Plot earthquake data
    data.features.forEach(function(feature) {
        // Extract necessary information from feature
        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];
        var mag = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        var place = feature.properties.place;

        // Create marker options based on magnitude and depth
        var markerOptions = {
            radius: mag * 5, // Adjust this factor for better visualization
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // Create marker and bind popup
        L.circleMarker([lat, lon], markerOptions)
            .bindPopup("Magnitude: " + mag + "<br>Location: " + place + "<br>Depth: " + depth + " km")
            .addTo(myMap);
    });

    // Create legend
    createLegend();
});










