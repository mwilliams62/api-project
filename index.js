//ddcfcefb488ad1af


let map;
let markers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.732080, lng: -122.553614},
    zoom: 12
  });
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

google.maps.event.addListener(map, 'click', function(event) {
    clearMarkers();
    addMarker(event.latLng, map);
});
}

 function addMarker(location, map) {
    const marker = new google.maps.Marker({
        position:location,
        map:map,
    });
    markers.push(marker);
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();
    const latLong = lat+','+lng
    getDataFromApi(latLong);
    console.log(latLong);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
    markers = [];
  }

function getDataFromApi(latLong) {  
    const conditionsUrl =`http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/${latLong}.json`;
    $.ajax({
        url: conditionsUrl,
        //url : "http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/48.693351,-122.610278.json",
        dataType : "jsonp",
        success : function(parsed_json) {
            console.log(parsed_json);
            let location = parsed_json['location']['city'];
            let temp_f = parsed_json['current_observation']['temp_f'];
            let wind_spd = parsed_json['current_observation']['wind_mph'];
            let wind_dir = parsed_json['current_observation']['wind_dir'];
            console.log("Current temperature in " + location + " is: " + temp_f+" and the wind is blowing from the "+wind_dir+" at "+wind_spd+" mph");
            //console.log(parsed_json);
        }
        });
    $.ajax({
        url:"http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/tide/q/48.693351,-122.610278.json",
        dataType: "jsonp",
        success :  function(parsed_json) {
            console.log(parsed_json);
            let results = [];
            for(var i = 0; i < parsed_json.tide.tideSummary.length; i++) {
                if ((parsed_json.tide.tideSummary[i].data.type === "Low Tide") || (parsed_json.tide.tideSummary[i].data.type === "High Tide")) {
                    results.push(parsed_json.tide.tideSummary[i]);   
                }
            }
            console.log(results);
            console.log(results[0].data.type+" will be "+results[0].data.height+" at "+results[0].date.pretty);
        }
    })
}


function displayResults() {
    $('.js-tides').html(result);
}

function listenSubmit() {
    $('.js-click').on('click', event => {
        event.preventDefault();
        getDataFromApi();
        console.log('button was clicked');
    })
}



function getWeather() {
    listenSubmit();
    //initMap();
}

$(getWeather);


