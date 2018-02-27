//ddcfcefb488ad1af

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.732080, lng: -122.553614},
    zoom: 12
  });
const loc_port = {lat: 48.693351, lng: -122.610278};  
const mark_port = new google.maps.Marker({
  position: loc_port,
  map:map,
  customInfo:"Marker1",
  title:"Portage Island"
});

const loc_bellBay = {lat: 48.752142, lng: -122.504546};
const mark_bellBay = new google.maps.Marker({
    position: loc_bellBay,
    map:map,
    customInfo:"Marker2",
    title:"Squalicum Harbor"
});
}

function getDataFromApi() {
    $.ajax({
        url : "http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/48.693351,-122.610278.json",
        dataType : "jsonp",
        success : function(parsed_json) {
            let location = parsed_json['location']['city'];
            let temp_f = parsed_json['current_observation']['temp_f'];
            let wind_spd = parsed_json['current_observation']['wind_mph'];
            let wind_dir = parsed_json['current_observation']['wind_dir'];
            console.log("Current temperature in " + location + " is: " + temp_f+" and the wind is blowing from the "+wind_dir+" at "+wind_spd+" mph");
        }
        });
    $.ajax({
        url:"http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/tide/q/48.693351,-122.610278.json",
        dataType: "jsonp",
        success : function(parsed_tide) {
            let tide_h = parsed_tide['tideSummary']['data']['height'];
            let tide_h_type = parsed_tide['tideSummary']['data']['type'];
            let tide_h_date = parsed_tide['tideSummary']['date']['pretty'];
            console.log(tide_h_type+": "+tide_h+" ( "+tide_h_date+" )")

        }
    })
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


