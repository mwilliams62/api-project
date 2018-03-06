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

//add a marker at the clicked location, use that lat/lng in called api
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

//use the lat/lng in api call for weather data
function getObservationDataFromApi(latLong, callback) {
    const conditionsUrl =`https://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/${latLong}.json`;
    $.ajax({
        url: conditionsUrl,
        dataType : "jsonp",
        success : callback
    });
}

// use lat/lng in api call for tide data
function getTideDataFromApi(latlong, callback) {
    $.ajax({
        url:`https://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/tide/q/${latlong}.json`,
        dataType: "jsonp",
        success :  callback
    })
}

//show the modal, generate rows for tide and sunrise/sunset data
function renderTideResult(tideResult) {
    $('.modal-content').removeClass('hidden');
    return `
        <tr>
            <td>${tideResult.data.type}: ${tideResult.data.height} ${tideResult.date.mon}/${tideResult.date.mday} ${tideResult.date.hour}:${tideResult.date.min}</td>
        </tr>`
}

//generate html for obervations
function renderObservationResult(obsResult) {
    return `
            <tr>
                <th><h2>${obsResult.display_location.full}</h2>
                </th>
            </tr>    
            <tr>
                <td>${obsResult.weather} and ${obsResult.temp_f}*F</td>
            </tr>
            <tr>
                <td>Wind ${obsResult.wind_string}</td>
            </tr>
            <tr>
                <td>Feels like ${obsResult.feelslike_f}*F</td>
            </tr>
            <tr>
                <td>Visibility: ${obsResult.visibility_mi} miles</td>
            </tr>
            <tr>
                <td>Barometer: ${obsResult.pressure_in} ${obsResult.pressure_trend}</td>
            </tr>`
}

//push the tide results to an array (parse next 4 high/low tide values, parse next sunrise and sunset, combine in one array)
function displayTideResults(info) {
    console.log(info);
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

//push observations into array, map to html, attempt modal
function displayObservationResults(info) {
    console.log(info);
    const obs = [];
    obs.push(info.current_observation);
    const obsSet = obs.map((item, index) =>
        renderObservationResult(item));
    $('.js-observations').html(obsSet);
    const modal = document.getElementById('result-modal')
    const modalTable = document.getElementById('modal-content')
    const span = document.getElementsByClassName("close")
    modal.style.display="block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    $('.close').click('span', function(event) {
        $('.modal-content').addClass('hidden');
    })
}



