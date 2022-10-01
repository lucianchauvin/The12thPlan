import data from "/events.json" assert { type: "json" };

window.onload = function () {
    var d = new Date();
    document.getElementById("day").selectedIndex = d.getDay();
    loadCurrent();

}
function timeConvert(timestart) {
    var date = new Date(timestart * 1000)
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    if (hours > 12) {
        var fintime = hours - 17 + ':' + minutes.substr(-2) + " pm";
    } else {
        var fintime = hours - 5 + ':' + minutes.substr(-2) + " am";
    }


    return fintime;
}

function loadCurrent() {
    var d = new Date();
    var day = d.getDay();
    var full = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    var table = `<table border=1 frame=void rules=rows> <tr id="titleBox"><th>Title</th><th>Location</th><th>Start Time</th></tr><tr><td colspan="3" id="eventDate"><b>Events today</b></td></tr>`;

    for (var i in data[full.toString()]) {
        table += `<tr><td><a href="https://calendar.tamu.edu/${data[full.toString()][i].link}">${data[full.toString()][i].title}</a></td><td><button>${data[full.toString()][i].location}</button></td>`;
        if (data[full.toString()][i].is_all_day) {
            table += `<td>All Day</td>`;
        }
        else {
            table += `<td>${timeConvert(data[full.toString()][i].timestart)}</td>`;
        }

    }
    for (var x = full + 1; x < Object.keys(data).at(-1); x++) {
        table += `<tr><td colspan="3" id="eventDate"><b>Events on ${x.toString().substring(4, 6)}/${x.toString().substring(6)}/${x.toString().substring(0, 4)}</b></td></tr>`;
        for (var i in data[x.toString()]) {
            table += `<tr><td><a href="https://calendar.tamu.edu/${data[x.toString()][i].link}">${data[x.toString()][i].title}</a></td><td><button>${data[x.toString()][i].location}</button></td>`;
            if (data[x.toString()][i].is_all_day) {
                table += `<td>All Day</td>`;
            }
            else {
                table += `<td>${timeConvert(data[x.toString()][i].timestart)}</td>`;
            }

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

