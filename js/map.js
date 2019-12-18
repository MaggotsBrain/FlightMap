
const Http = new XMLHttpRequest();
const url='http://localhost:8080/icao';
Http.open("POST", url);
Http.send();


var map;

var mapStyle = '';

$.get('map_style.js', function (data) {
    if (data) {
        mapStyle = JSON.parse(data);
    }
});

function initMap(listener) {

    var usersLocation = {
        lat: 52.520,
        lng: 13.404
    };

    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        center: usersLocation,
        zoom: 8,
        styles: mapStyle
    });

    var getLatEl = document.getElementById('latitude');
    getLat = parseFloat(getLatEl.innerHTML);
    var getLongEl = document.getElementById('longitude');
    getLong = parseFloat(getLongEl.innerHTML);
    var gettrueHeadingEl = document.getElementById('trueHeading');
    getTrueHeading = parseFloat(gettrueHeadingEl.innerHTML);

    var planeSymbol = {
        path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
        scale: 0.05,
        strokeOpacity: 1,
        color: 'black',
        strokeWeight: 2,
        rotation: getTrueHeading,
        anchor: new google.maps.Point(400, 400)
    };

    var marker = new google.maps.Marker({
        id: "1",
        position: usersLocation,
        map: map,
        title: Http.responseText,
        content: 'some information',
        icon: planeSymbol
    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

    var polyline = new google.maps.Polyline({
        map: map,
        path: []
    })

    // Move aircraft
    setInterval(function () {

        var getLatEl = document.getElementById('latitude');
        getLat = parseFloat(getLatEl.innerHTML);
        var getLongEl = document.getElementById('longitude');
        getLong = parseFloat(getLongEl.innerHTML);
        var gettrueHeadingEl = document.getElementById('trueHeading');
        getTrueHeading = parseFloat(gettrueHeadingEl.innerHTML);

        var planeSymbol = {
            path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
            scale: 0.0333,
            strokeOpacity: 1,
            color: 'black',
            strokeWeight: 1,
            rotation: getTrueHeading,
            anchor: new google.maps.Point(400, 400)
        };

        if (marker && marker.setPosition) {
            marker.setPosition(new google.maps.LatLng(getLat, getLong));
            var newIcon = marker.getIcon()
            newIcon.rotation = getTrueHeading;
            marker.setIcon(newIcon);
            polyline.getPath().push(marker.getPosition());

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });

        } else {
            marker = new google.maps.Marker({
                position: usersLocation,
                map: map,
                title: 'Username',
                icon: planeSymbol
            });


            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });

        }
    }, 3000);

    marker.setMap(map);
    //  moveAircraft(map, marker);
    var angle = 0;

    function simulateMovement() {
        angle += 1;
        var newPt = google.maps.geometry.spherical.computeOffset(new google.maps.LatLng(52.520, 13.404), 100000, angle);
        document.getElementById('latitude').innerHTML = newPt.lat();
        document.getElementById('longitude').innerHTML = newPt.lng();
        var heading = angle + 90;
        document.getElementById('trueHeading').innerHTML = heading;
    }

    setInterval(simulateMovement, 1000);
}
