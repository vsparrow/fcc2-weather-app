
// functions: 
// getLoc  main func to get coordinates
// 					input: none
// 					output: array with geolocation data [latitude,longitude] ->to getWeather? or callWeatherApi
// 	getLocHTML5 use HTML5 to get location1
// 					input: none
// 					output:-1 if error , else array with geolocation data [latitude,longitude
// 	getLocIP  use IP to get location of HTML5 failure
// 					input: none
// 					output:-1 if error , else array with geolocation data [latitude,longitude

// getWeather main func use location to call api
// 	callWeatherApi 	function to get JSON data from api
// 						input: array with geolocation data [latitude,longitude]
// 						output:array with JSON inside [{key: value}]
// 	parseJSON 		function to parse JSON data from callWeatherApi: get temp, weather etc
// 						input: array with JSON inside [{key: value}]
// 						output:array [location name, temperature, weather condition, icon? if available]
// 	displyWeather	function to show data
// 						input: array [location name, temperature, weather condition, icon? if available]
// 						output:	0 if susccesful, -1 if error


// **********************************************************************  getLocHTML5
function getLocHTML5(){

	function success(position){
		var latitude  = position.coords.latitude;
    	var longitude = position.coords.longitude;
    	console.log(latitude + " " + longitude);
	}
	function error(){
		console.log("Error get geolocation via function getLocHTML5");
	}
	navigator.geolocation.getCurrentPosition(success, error);
}

// **********************************************************************  getLocIp
// **********************************************************************

//http://ip-api.com/json for IP geolocation
//pure JS no jQuery : http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function getLocIp(){
	loadJSON("http://ip-api.com/json",
	         function(data) { if(data)console.log(data); },
	         function(xhr)  { if(xhr)console.error(xhr); }
	);
}
// **********************************************************************
function loadJSON(path, success, error)	{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) { if (success) success(JSON.parse(xhr.responseText)); } 
            else { if (error) error(xhr);}
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

// **********************************************************************
// **********************************************************************







// getLocHTML5();  //works unomment
getLocIp()

// data below from initial creation use as reference
// <script type="text/javascript">
// if ("geolocation" in navigator) { /* geolocation is available */

// 	console.log("geolocation available");// alert("geolocation available"); 
// 	navigator.geolocation.getCurrentPosition(function(position,error) {
//   		if(error){ console.log("There was an error getting your position");}
//    		else {console.log("Latitude: "+position.coords.latitude +" Longitude: " + position.coords.longitude)}
// 	});

// } else { /* geolocation IS NOT available */  
//   console.log("geolocation NOT available");
// }

// }
// }

// function success(position){
// 	console.log("Latitude: "+position.coords.latitude +" Longitude: " + position.coords.longitude);
// }
// function error{
// 	console.log("There was an error getting your position");
// }
//   navigator.geolocation.getCurrentPosition(success, error);
// </script>