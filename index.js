//ddcfcefb488ad1af


let map;
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

google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
        const markerTitle = toString(event.latLng);
        getDataFromApi(event.latLng);
  });

}

function addMarker(location, map) {
    var marker = new google.maps.Marker({
        position:location,
        map:map,
    })
}


function getDataFromApi(latLng, callback) {  
    // $.ajax({
    //     url : "http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/conditions/q/48.693351,-122.610278.json",
    //     dataType : "jsonp",
    //     success : function(parsed_json) {
    //         let location = parsed_json['location']['city'];
    //         let temp_f = parsed_json['current_observation']['temp_f'];
    //         let wind_spd = parsed_json['current_observation']['wind_mph'];
    //         let wind_dir = parsed_json['current_observation']['wind_dir'];
    //         console.log("Current temperature in " + location + " is: " + temp_f+" and the wind is blowing from the "+wind_dir+" at "+wind_spd+" mph");
    //         console.log(parsed_json);
    //     }
    //     });
    $.ajax({
        url:"http://api.wunderground.com/api/ddcfcefb488ad1af/geolookup/tide/q/48.693351,-122.610278.json",
        dataType: "jsonp",
        success :  function(parsed_json) {
            console.log(parsed_json);
            let results = [];
            for(var i = 0; i < parsed_json.tide.tideSummary.length; i++) {
                if ((parsed_json.tide.tideSummary[i].data.type === "Low Tide") || (parsed_json.tide.tideSummary[i].data.type === "High Tide")
                   || (parsed_json.tide.tideSummary[i].data.type = "Sunrise") || (parsed_json.tide.tideSummary[i].data.type = "Sunset")) {
                    results.push(parsed_json.tide.tideSummary[i]);
                    
                }
            
            }
            return(results);
            console.log(results);
            //let tideLocation = parsed_json['location']['city'];
            // let tideSummary = parsed_json.tideSummary.map((data, index) =>
            //     renderResult(data));
            // console.log(tideSummary);
            //let tideHeight = parsed_json['tideInfo']['tideSite'];
            // // let tideType = parsed_json['tideSummary']['type'];
            // // let tideTime = parsed_json['tideSummary']['pretty'];
            // // console.log(tideType+": "+tideHeight+" ( "+tideTime+" )")
            // console.log(tideLocation);
            // console.log(parsed_json);
        }
    })
}

function renderResult(result) {
    console.log(result);
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


