import data from "http://lucianchauvin.github.io/The12thPlan/events.json" assert { type: "json" };
import mapData from "http://lucianchauvin.github.io/The12thPlan/parsedMap.json" assert { type: "json" };

window.onresize = function () { location.reload(); }

var flyLat = 0;
var flyLog = 0;
var listDates = [];

//Responsive Scaling
let outer = document.getElementById('outer'),
    wrapper = document.getElementById('wrap'),
    maxWidth = outer.clientWidth,
    maxHeight = outer.clientHeight;

window.addEventListener("resize", resize);
resize();

function resize() {
    let scale,
        width = window.innerWidth,
        height = window.innerHeight,
        isMax = width >= maxWidth && height >= maxHeight;

    scale = Math.min(width / maxWidth, height / maxHeight);
    outer.style.transform = isMax ? '' : 'scale(' + scale + ')';
    wrapper.style.width = isMax ? '' : maxWidth * scale;
    wrapper.style.height = isMax ? '' : maxHeight * scale;
}


window.onload = function () {
    var d = new Date();
    document.getElementById("day").selectedIndex = (d.getDay());
    loadCurrent();
    document.getElementById("Calendar View").onclick = function () { CALENDERPOPUP(); };
    // x.toString().substring(4, 6)}/${x.toString().substring(6)}/${x.toString().substring(0, 4)
    var dropDown = document.getElementById("day");
    for (var x = Object.keys(data).at(0); x <= Object.keys(data).at(-1); x++) {
        const option = document.createElement("option");
        option.value = `${x.toString().substring(4, 6)}/${x.toString().substring(6)}/${x.toString().substring(0, 4)}`;
        option.text = `${x.toString().substring(4, 6)}/${x.toString().substring(6)}/${x.toString().substring(0, 4)}`;
        dropDown.appendChild(option);
        listDates.push(x.toString());
        console.log(x.toString());

    }
    console.log(listDates);

    // document.getElementById(listDates[1]).scrollIntoView();
}

document.getElementById('day').onchange = function () {
    var index = this.selectedIndex;
    console.log(listDates[index]);
    document.getElementById(listDates[index]).scrollIntoView();
}



function timeConvert(timestart) {
    // var date = new Date(timestart * 1000)
    // var hours = date.getHours();
    // var minutes = "0" + date.getMinutes();
    // var second = "0" + date.getSeconds();
    // if (hours > 12) {
    //     var fintime = hours - 17 + ':' + minutes.substr(-2) + " pm";
    // } else {
    //     var fintime = hours - 5 + ':' + minutes.substr(-2) + " am";
    // }


    // return fintime;
    var am_or_pm = '';
    var year = ~~(timestart / 31556926);
    var timewithoutyear = timestart - (year * 31556926);
    var month = ~~(timewithoutyear / 2629743);
    var timewithoutmonth = timewithoutyear - (month * 2629743);
    var week = ~~(timewithoutmonth / 604800);
    var timewithoutweek = timewithoutmonth - (week * 604800);
    var day = ~~(timewithoutweek / 86400);
    var timewithoutday = timewithoutweek - (day * 86400);
    var hour = ~~(timewithoutday / 3600);
    var timewithouthour = timewithoutday - (hour * 3600);
    var minute = ~~(timewithouthour / 60) - 22;

    if (minute == 0) {
        minute = '00';
    }
    if (hour > 12) {
        hour = hour - 12
        am_or_pm = " pm";
    }
    else {
        hour = hour
        am_or_pm = " am";
    }
    var fintime = hour + ':' + minute + am_or_pm;
    return fintime
}

function CALENDERPOPUP() {
    window.open(
        "calendar.html", 'popUpWindow', 'height=500,width=900,left=10,top=10,resizable=no,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
}

async function fly(bul) {
    console.log(bul);
    var found = false;
    var lat = 0;
    var log = 0;
    for (var i in mapData['features']) {
        if (mapData['features'][i].properties.name == bul) {

            lat = mapData['features'][i].geometry.coordinates[0];
            log = mapData['features'][i].geometry.coordinates[1];
            found = true;
        }
    }

    if (!found) {
        for (var i in mapData['features']) {
            var count = 0;
            for (var word in mapData['features'][i].properties.name.split(" ")) {
                for (var word2 in bul.split(" ")) {
                    if (mapData['features'][i].properties.name.split(" ")[word] == bul.split(" ")[word2]) {
                        count += 1;
                    }
                }
            }
            if (count > 1) {
                lat = mapData['features'][i].geometry.coordinates[0];
                log = mapData['features'][i].geometry.coordinates[1];
                console.log(mapData['features'][i].properties.name + " " + bul);
                found = true;
            }
        }
    }

    if (!found) {
        await getCoordinates(bul);
        log = flyLog;
        lat = flyLat;
        found = true;
    }

    map.flyTo({
        center: [log, lat],
        zoom: 18,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });



}

function loadCurrent() {
    var d = new Date();
    var day = d.getDay();
    var full = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    var table = `<table id="eventTable" border=1 frame=void rules=rows> <tr id="titleBox"><th>Title</th><th>Location</th><th>Start Time</th>`;

    var eventsLoaded = 0;
    // for (var i in data[full.toString()]) {

    //     table += `<tr><td><a href="https://calendar.tamu.edu/${data[full.toString()][i].link}">${data[full.toString()][i].title}</a></td><td><button id="${data[full.toString()][i].id}">${data[full.toString()][i].location}</button></td>`;
    //     if (data[full.toString()][i].is_all_day) {
    //         table += `<td>All Day</td>`;
    //     }
    //     else {
    //         table += `<td>${timeConvert(data[full.toString()][i].timestart)}</td>`;
    //     }
    //     table += `</tr>`;
    //     eventsLoaded += 1;

    // }
    console.log(Object.keys(data).at(0), Object.keys(data).at(-1))
    for (var x = Object.keys(data).at(0); x <= Object.keys(data).at(-1); x++) {
        table += `<tr><td colspan="3" id="${x.toString()}" class="eventDate"><b>Events on ${x.toString().substring(4, 6)}/${x.toString().substring(6)}/${x.toString().substring(0, 4)}</b></td></tr>`;
        for (var i in data[x.toString()]) {
            table += `<tr><td><a href="${data[x.toString()][i].link}" target="_blank">${data[x.toString()][i].title}</a></td><td><button class="eventButton" id="${data[x.toString()][i].id}">${data[x.toString()][i].location}</button></td>`;
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
    connectEvents();
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

    var html = `<h2>Events at ${feature.properties.name}</h2>`
    for (var i in data) {
        for (var j in data[i]) {
            if (data[i][j].location == feature.properties.name) {
                html += `<a href="${data[i][j].link}" target="_blank"> <h3>${data[i][j].title} - `;
                if (data[i][j].is_all_day) {
                    html += `All Day`;
                }
                else {
                    html += `${timeConvert(data[i][j].timestart)}`;
                }
                html += `</h3> </a>`;
                html += `<img class="center" width=400px src="${data[i][j].img}">`;
                html += `<p>${data[i][j].description}</p>`
            }
        }
    }

    const popup = new mapboxgl.Popup({ offset: 15 })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
            html
        )
        .setMaxWidth('500px')
        .addTo(map);



});

function connectEvents() {
    for (var i in data) {
        for (var j in data[i]) {
            const location = data[i][j].location;
            const id = data[i][j].id;
            console.log(document.getElementById(id));
            document.getElementById(id).addEventListener("click", () => {
                console.log(location);
                fly(location);
            });
            console.log("Added event listener to " + id);

        }
    }

    // var d = new Date();
    // var day = d.getDay();
    // var full = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    // for (var j in data[full.toString()]) {
    //     console.log(data[full.toString()][j].id, data[full.toString()][j]);
    //     const location = data[full.toString()][j].location;
    //     const id = data[full.toString()][j].id;
    //     console.log(document.getElementById(id));
    //     document.getElementById(id).addEventListener("click", () => {
    //         fly(location);
    //     });
    //     console.log("Added event listener to " + id);

    // }

}

async function getCoordinates(address) {
    address = address.replaceAll(" ", "+") + ",+College+Station,+TX";
    var coordinates = [];
    let response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=' + "AIzaSyAjT5Smj1-WcSyFUn8f7UUPiqGeZvVPbYc");
    let json = await response.json();
    flyLat = json['results'][0]['geometry']['location']['lat'];
    flyLog = json['results'][0]['geometry']['location']['lng'];
    console.log([flyLat, flyLog]);
}

function dropdownscroll() {
    // var value = document.getElementById("Day").selectedOptions[0].value;
    document.getElementById("").scrollIntoView();
}
