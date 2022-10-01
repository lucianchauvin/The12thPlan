import data from "/events.json" assert { type: "json" };

window.onload = function () {
    var d = new Date();
    console.log(d.getDay());
    document.getElementById("day").selectedIndex = d.getDay();
    loadCurrent();

}
function timeConvert(timestart) {
    var afteryear = timestart%31556926;
    var month = afteryear//2629743;
    var aftermonth = afteryear%2629743;  
}

function loadCurrent() {
    var d = new Date();
    var day = d.getDay();
    var full = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    var table = `<table border=1 frame=void rules=rows> <tr id="titleBox"><th>Title</th><th>Location</th><th>Time</th></tr><tr><td colspan="3" id="eventDate"><b>Events today</b></td></tr>`;

    for (var i in data[full.toString()]) {
        table += `<tr><td>${data[full.toString()][i].title}</td><td>${data[full.toString()][i].location}</td>`;
        if (data[full.toString()][i].is_all_day) {
            table += `<td>All Day</td>`;
        }
        else {
            table += `<td>${data[full.toString()][i].timestart}</td>`;
        }

    }
    table += `</table>`
    document.getElementById("events").innerHTML = table;
}
 

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=Yn14RMJ5TL4jFpJSAG80',
    center: [-96.341195, 30.615498],
    zoom: 15.5
});

map.on('load', function () {
    map.addSource('geojson-overlay', {
        'type': 'geojson',
        'data': 'parsedMap.geojson'
    });
    map.addLayer({
        'id': 'geojson-overlay-point',
        'type': 'symbol',
        'source': 'geojson-overlay',
        'layout': {
            'text-field': ['get', 'name'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],
            'text-anchor': 'top',
        },
        'paint': {
            'text-color': '#500000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
        }
    });
});
map.on('click', (event) => {
    // If the user clicked on one of your markers, get its information.
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['geojson-overlay-point'] // replace with your layer name
    });
    if (!features.length) {
        return;
    }
    const feature = features[0];
    console.log(feature.properties);

    const popup = new mapboxgl.Popup({ offset: 15 })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
            `<h3>${feature.properties.name}</h3>`
        )
        .setMaxWidth('5000')
        .addTo(map);

});

