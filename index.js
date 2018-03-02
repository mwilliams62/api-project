//ddcfcefb488ad1af

let markers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.732080, lng: -122.553614},
    zoom: 12
  });
  google.maps.event.addListener(map, 'click', function(event) {
    clearMarkers();
    addMarker(event.latLng, map);
});
}
// const loc_port = {lat: 48.693351, lng: -122.610278};
// const mark_port = new google.maps.Marker({
//   position: loc_port,
//   map:map,
//   customInfo:"Marker1",
//   title:"Portage Island",
//   clickable:true,
// });

// const loc_bellBay = {lat: 48.752142, lng: -122.504546};
// const mark_bellBay = new google.maps.Marker({
//     position: loc_bellBay,
//     map:map,
//     customInfo:"Marker2",
//     title:"Squalicum Harbor",
//     clickable: true,
// });



 function addMarker(location, map) {
    const marker = new google.maps.Marker({
        position:location,
        map:map,
    });
    markers.push(marker);
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();
    const latLong = lat+','+lng
    getTideDataFromApi(latLong, displayTideResults);
    getObservationDataFromApi(latLong, displayObservationResults);
    console.log(latLong);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map and empties array
  function clearMarkers() {
    setMapOnAll(null);
    markers = [];
  }

function getObservationDataFromApi(latLong, callback) {
    const conditionsUrl =`http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/${latLong}.json`;
    $.ajax({
        url: conditionsUrl,
        dataType : "jsonp",
        success : callback
    });
}

function getTideDataFromApi(latlong, callback) {
    $.ajax({
        url:"http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/tide/q/48.693351,-122.610278.json",
        dataType: "jsonp",
        success :  callback
    })
}

function renderTideResult(tideResult) {
    $('.modal-content').removeClass('hidden');
    $('.result-modal').removeClass('hidden');

    $('.map').addClass('hidden');
    return `
        <tr>
            <td>${tideResult.data.type}: ${tideResult.data.height} ${tideResult.date.mon}/${tideResult.date.mday} ${tideResult.date.hour}:${tideResult.date.min}</td>
        </tr>`
}

function renderObservationResult(obsResult) {
    return `
            <tr>
                <th><h2>${obsResult.display_location.full}</h2>
                </th>
            </tr>    
            <tr>
                <td>Summary: ${obsResult.weather}</td>
            </tr>
            <tr>
                <td>${obsResult.temp_f}*F, Feels like ${obsResult.feelslike_f}*F</td>
            </tr>
            <tr>
                <td>Wind ${obsResult.wind_string}</td>
            </tr>`
}

function displayTideResults(info) {
    const tides = [];
    for(var i = 0; i < info.tide.tideSummary.length; i++) {
        if ((info.tide.tideSummary[i].data.type === "Low Tide") || (info.tide.tideSummary[i].data.type === "High Tide")) {
            tides.push(info.tide.tideSummary[i]);
        }
    }
    const tideSet = tides.slice(0,4);
    const sun = [];
    for(var i = 0; i < info.tide.tideSummary.length; i++) {
        if ((info.tide.tideSummary[i].data.type === "Sunset") || (info.tide.tideSummary[i].data.type === "Sunrise")) {
            sun.push(info.tide.tideSummary[i]);
        }
    }
    const sunSlice = sun.slice(0,2);
    for(var i = 0; i < sunSlice.length; i++) {
        tideSet.push(sunSlice[i]);
    }
    const tidepool = tideSet.map((item, index) =>
        renderTideResult(item));
    $('.js-tides').html(tidepool);
}

function displayObservationResults(info) {
    console.log(info);
    const obs = [];
    obs.push(info.current_observation);
    const obsSet = obs.map((item, index) =>
        renderObservationResult(item));
    $('.js-observations').html(obsSet);
    const modal = document.getElementById('result-modal')
    const span = document.getElementsByClassName("close")
    modal.style.display="block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    span.onclick = function(event) {
        modal.style.display = "none"
    }
}



