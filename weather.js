
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
// "Director" of query
function getLoc(){
 	var html5 = getLocHTML5();
 	console.log(html5);
}

//problem waiting for return data
//findings: The "good node.js /event driven" way of doing this is to not wait.
//The caller should not wait for the value to be "returned" in the normal sense,
// but rather send the routine that will handle the resulting value:


// **********************************************************************  getLocHTML5
function getLocHTML5(){

	function success(position){
		var latitude  = position.coords.latitude;
    	var longitude = position.coords.longitude;
    	// console.log(latitude + " " + longitude);
    	console.log ([latitude,longitude,"HTML5"]);
    	getWeather([latitude,longitude,"HTML5"]);
    	// return [latitude,longitude,"HTML5"];
	}
	function error(){
		// console.log("Error get geolocation via function getLocHTML5");
		getLocIp();
		return -1
	}
	navigator.geolocation.getCurrentPosition(success, error);
}

// **********************************************************************  getLocIp
// **********************************************************************

//http://ip-api.com/json for IP geolocation
//pure JS no jQuery : http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function getLocIp(){
	loadJSON("http://ip-api.com/json",
	         // function(data) { if(data)console.log(data.lat + " " +data.lon); },
	         function(data) { 
	         	if(data) {
	         		console.log([data.lat,data.lon,"IP"]);
	         		getWeather([data.lat,data.lon,"IP"]);
	         		// return[data.lat,data.lon,"IP"];
	         	}  
	         },
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

// ********************************************************************** getCityState
// ********************************************************************** unneeded, only need lat lon for apu


function getCityState(arr){
	var lat = arr[0];
	var lon = arr[1];
	var api = "http://api.geonames.org/findNearestAddressJSON?lat=" + lat;
		api += "&lng=" + lon + "&username=demo";
	loadJSON( api,
	    function(data) { 
	       	if(data) {
	       		console.log("from getCityState");
	       		console.log(api);
	       		console.log(data);
	       		// console.longitude([data.lat,data.lon,"IP"]);
	       		// return[data.lat,data.lon,"IP"];
	       	}  
	    },
	   function(xhr)  { if(xhr)console.error(xhr); }
	);
}
// **********************************************************************  getWeather
// 

function getWeather(arr){
	var lat = arr[0];
	var lon = arr[1];
	console.log("getWeather :"+lat + " " + lon);

	var api = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=061f24cf3cde2f60644a8240302983f2";
	var units="&units=Imperial"
	//api.openweathermap.org/data/2.5/weather?lat=35&lon=139
	arr.push(api);
	arr.push("Imperial");

    //wlink= "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&mode=json&units=" + wType + "&APPID=061f24cf3cde2f60644a8240302983f2";

	loadJSON( (api+units),
	    function(data) { 
	       	if(data) {
	       		console.log("from getWeather");
	       		console.log(api);
	       		console.log(arr);
	       		console.log(data);
	       		parseWeather(data);
	       		// console.longitude([data.lat,data.lon,"IP"]);
	       		// return[data.lat,data.lon,"IP"];
	       	}  
	    },
	   function(xhr)  { if(xhr)console.error(xhr); }
	);
}
//********
// **********************************************************************  parseWeather
//send array to displayWeather()

function parseWeather(wObj){  //accept weather object
	console.log("parseWeather:")
	console.log(wObj);

	var city = wObj.name;
	var temp = wObj.main.temp; //number
	var wDescription = wObj.weather[0].description;
	var wIcon = wObj.weather[0].icon; //string
	wIcon = wIconSelector(wIcon);
	temp  = Math.round(temp);
	wDescription = wDescription[0].toUpperCase()+wDescription.slice(1);
	console.log(city +" " +temp + " " + wDescription + " " + wIcon);
	console.log(typeof temp)
	displayWeather([city,temp,wDescription,wIcon]);
}

// **********************************************************************  iconSelector
// takes in weather icon number from openweather and converts it to Weather icons by Erik Flowers
// https://erikflowers.github.io/weather-icons/

// Day icon 	Night icon 	Description 		weather-icons-day		weather-icons-night
// 01d.png 	01n.png 	clear sky			wi-day-sunny			wi-night-clear
// 02d.png 	02n.png 	few clouds			wi-day-cloudy			wi-night-cloudy
// 03d.png 	03n.png 	scattered clouds	wi-day-cloudy			wi-night-cloudy
// 04d.png 	04n.png 	broken clouds		wi-day-cloudy			wi-night-cloudy
// 09d.png 	09n.png 	shower rain 		wi-day-rain				wi-night-rain
// 10d.png 	10n.png 	rain				wi-day-rain				wi-night-rain		
// 11d.png 	11n.png 	thunderstorm		wi-day-storm-showers	wi-night-storm-showers
// 13d.png 	13n.png 	snow				wi-day-snow				wi-night-snow
// 50d.png 	50n.png 	mist 				wi-day-fog				wi-night-fog

function wIconSelector(wIcon){
//take openweather icon and translate to weather icons by Erik Flowers
//wIcon is typof String
	var wIcon2 = "wi-thermometer-exterior"; //default
	switch(wIcon){
		case "01d" :  wIcon2="wi-day-sunny"; break;
		case "01n" :  wIcon2="wi-night-clear"; break;
		case "02d" :  wIcon2="wi-day-cloudy"; break;
		case "02n" :  wIcon2="wi-night-cloudy"; break;
		case "03d" :  wIcon2="wi-day-cloudy"; break;
		case "03n" :  wIcon2="wi-night-cloudy"; break;
		case "04d" :  wIcon2="wi-day-cloudy"; break;
		case "04n" :  wIcon2="wi-night-cloudy"; break;
		case "09d" :  wIcon2="wi-day-rain"; break;
		case "09n" :  wIcon2="wi-night-rain"; break;
		case "10d" :  wIcon2="wi-day-rain"; break;
		case "10n" :  wIcon2="wi-night-rain"; break;
		case "11d" :  wIcon2="wi-day-storm-showers"; break;
		case "11n" :  wIcon2="wi-night-storm-showers"; break;
		case "13d" :  wIcon2="wi-day-snow"; break;
		case "13n" :  wIcon2="wi-night-snow"; break;
		case "50d" :  wIcon2="wi-day-fog"; break;
		case "50n" :  wIcon2="wi-night-fog"; break;
	}
	return wIcon2;
}

// **********************************************************************  diplay weather
//not yet initialized using test datas! 
//get from parseWeather
//console.log(city +" " +temp + " " + wDescription + " " + wIcon);
function displayWeather(arr){
	var city 			= arr[0];
	var temp 			= arr[1];
	var wDescription 	= arr[2];
	var wIcon 			= arr[3];

	document.querySelector("#location").innerText = city;
	document.querySelector("#temp").innerText = temp;
	document.querySelector("#wDescription").innerText = wDescription ; 
	document.querySelector("#wIcon").innerHTML = '<i class="wi ' + wIcon + '"></i>'; ;
}



getLocHTML5();  //works unomment
//displayWeather(["Beverly Hills", "77", "Sunny", "wi-day-sunny"]);
//getLocIp()
// getLoc();
// var test = getLocHTML5() //.then(console.log())
// setTimeout(function(){console.log(test),300})
// getCityState([40.92316,-73.8377]);
// getWeather([40.92316,-73.8377]);

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