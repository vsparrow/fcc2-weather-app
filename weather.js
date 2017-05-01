
// functions: 
// In order of app cycle. Main functions listed

	// getLocIp 		use IP to get location
	// 					use of HTML5 geolocation diregarded. Bad UX, needed to wait for user acceptance
	// 					input: none
	// 					success:call getWeather([data.latitude,data.longitude,city])
	// 					error: 	call errorGettingData
	
	// getWeather 		call api to get weather info
	// 					input: [data.latitude,data.longitude,city]
	// 					success:call parseWeather(api response object, city); 
	// 					error: 	call errorGettingData
	
	// paseWeather		parse data into consumable variables			
	// 					input: (api response object, city)
	// 					success: displayWeather([city,temp,weather Description,Icon,temp in C])
	
	// displayWeather	display weather to user
	// 					input [city,temp,weather Description,Icon,temp in C]


// **********************************************************************  getLocIp

function getLocIp(){
	loadJSON("https://ipapi.co/json/",
	         function(data) { 
	         	if(data) {
	         		var city = data.city;
	         		getWeather([data.latitude,data.longitude,city]);  
	         	}  
	         },
	         function(xhr) { 
	         	if(xhr){
	         		console.error(xhr);
	         		errorGettingData();  //if error getting location show error message	
	         	} 
	         }
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


// **********************************************************************  getWeather darksky
function getWeather(arr){
	var lat = arr[0];
	var lon = arr[1];

    var api = "https://api.darksky.net/forecast/c1c79c93374cb0e0b5e2439d84fd12f5/"; 
    api += lat + "," + lon + "?exclude=minutely,hourly,daily";
	
	//had to use ajax over loadJSON because kept getting
	//No 'Access-Control-Allow-Origin' header is present on the requested resource. 
	//Origin 'null' is therefore not allowed access. 
	$.ajax({
	    url: api,
	 	type: "GET`",
	 	dataType: "jsonp",
	    success: function( response ) {
	        parseWeather(response,arr[2]);
	    },
	    error: function(){
	    	errorGettingData(); //display error message if unable to contact darksky
	    }
	});
}  


// **********************************************************************  parseWeather darksky
 
function parseWeather(wObj,city){  //accept weather object

	//city passed in from outside function. better than using global var
	var temp = wObj.currently.apparentTemperature;
	var wDescription = wObj.currently.summary;
	var wIcon = wObj.currently.icon //String
	var tempC = getCelcius(temp);

	wIcon = wIconSelector(wIcon);
	temp  = Math.round(temp);

	displayWeather([city,temp,wDescription,wIcon,tempC]);
}

// **********************************************************************  iconSelector   darksky

function wIconSelector(wIcon){
//take darksky icon and translate to weather icons by Erik Flowers
//wIcon is typof String
	wIcon = wIcon.toUpperCase();
	console.log("wIcon in wIconSelector after toUpperCase :: " + wIcon)
	var wIcon2 = "wi-thermometer-exterior"; //default
	switch(wIcon){
		case "CLEAR-DAY" : 				wIcon2 	= "wi-day-sunny"; break;		//for darksky
		case "CLEAR-NIGHT" : 			wIcon2 	= "wi-night-clear"; break;
		case "PARTLY-CLOUDY-DAY" : 		wIcon2 	= "wi-day-sunny-overcast"; break;
		case "PARTLY-CLOUDY-NIGHT" : 	wIcon2	= "wi-night-partly-cloudy"; break;
		case "CLOUDY" : 				wIcon2	= "wi-cloudy"; break;
		case "RAIN" : 					wIcon2	= "wi-rain"; break;
		case "SLEET" : 					wIcon2	= "wi-sleet"; break;
		case "SNOW" : 					wIcon2	= "wi-snow"; break;
		case "WIND" : 					wIcon2	= "wi-windy"; break;
		case "FOG" : 					wIcon2	= "wi-fog"; break;
	}
	return wIcon2;
}

// **********************************************************************  diplay weather
function displayWeather(arr){
	var city 			= arr[0];
	var temp 			= arr[1];
	var wDescription 	= arr[2];
	var wIcon 			= arr[3];

	document.querySelector("#location").innerText = city;
	document.querySelector("#temp").innerText = temp;
	document.querySelector("#wDescription").innerText = wDescription ; 
	document.querySelector("#wIcon").innerHTML = '<i class="wi ' + wIcon + '"></i>'; 

	document.querySelector("#cspan").addEventListener("click",function(){fcToggle()}); 
	document.querySelector("#fspan").addEventListener("click",function(){fcToggle()}); 
}

// **********************************************************************  F to C conversion

function getCelcius(f){
	console.log("f is " +f)
	var c = (f - 32) * 5 / 9;
	console.log("C is " +c) 
	return Math.round(c);
}
// **********************************************************************  F to C toggle

function fcToggle(){
	var f = document.querySelector("#f");
	var c = document.querySelector("#c");

	f.classList.toggle("hide");
	c.classList.toggle("hide");
}

// **********************************************************************  errorGettingData
// if error getting data, this function is called to let user know

function errorGettingData(){
	var display = document.querySelector(".well");
	var displayHTML = '<h1>Unable To Display Weather At The Moment</h1>'

	displayHTML += '<h2>Please Try Again Later</h2>'
	displayHTML += '<h3>We apologize for the inconvenience</h3>'
	display.innerHTML = displayHTML;
}


// **********************************************************************  Start App
getLocIp();

