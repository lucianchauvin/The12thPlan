import data from "/bigData.json" assert { type: "json" };


function bldCur(feature, buld) {
    var d = new Date();
    var day = d.getDay();
    var time = d.getHours() * 100 + d.getMinutes();

    var str = "";
    str += `<h3>${feature.properties.name} - ${feature.properties.code}</h3>`;
    str += `<table><tr><th>Room</th><th>Subj/Num-Sec</th><th>Name</th><th>Teacher</th></tr>`;
    for (var i in data) {
        for (var j = 0; j < data[i].length; j++) {
            if (data[i][j]['building'] == buld && data[i][j]['days'][day] && data[i][j]['beginTime'] <= time && data[i][j]['endTime'] >= time) {
                console.log("found");
                str += `<tr><td>${data[i][j]['room']}</td><td>${data[i][j]["subject"]}${data[i][j]['courseNum']}-${data[i][j]['section']}</td><td>${data[i][j]['courseTitle']}</td><td>${data[i][j]["teacher"]}</td></tr>`;
            }
        }
    }
    str += `</table>`;
    return str;

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

    const div = bldCur(feature, feature.properties.code);

    const popup = new mapboxgl.Popup({ offset: 15 })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
            div
        )
        .setMaxWidth('5000')
        .addTo(map);

});