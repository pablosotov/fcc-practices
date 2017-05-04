$(document).ready(function() {
   ///////////////////////////////
   // get the current local time
   ///////////////////////////////
   var hrs,min,sec,time,dt;
   var x = setInterval(function() {
      dt = new Date();
      hrs = dt.getHours();
      
      min = dt.getMinutes();
      if (min<10){min = "0"+min;}
      
      sec = dt.getSeconds();
      if (sec<10){sec = "0"+sec;}   
      
      if(hrs==12 && min>0){
         time = hrs+":"+min+":"+sec+" p.m.";
         $("#time").html(time);
      }
      else if(hrs>12){      
         hrs -= 12;
         time = hrs+":"+min+":"+sec+" p.m.";
         $("#time").html(time);
      }
      else {
         time = hrs+":"+min+":"+sec+" a.m.";
         $("#time").html(time);
      }
   },1000);
   // determine the light, i.e., if it is daytime or nighttime
   if (hrs > 4 && hrs < 19) {
      var light = "day-";
   } else { var light = "night-"; }

   /////////////////////////////////////////////////
   // Identify your location city and country
   /////////////////////////////////////////////////
   myLocation();  
   function myLocation(coordenates, myCountry){
      $.get(
         "https://ipinfo.io",  // they provide a location data json
         function(location,fullname) {
            console.log(location);
            coordenates = location.loc.split(",");
            var lat = coordenates[0];
            var lon = coordenates[1];

            myCountry = location.country;
            $("#location").html(location.city+", "+location.region); 
            // Countries that don't use metric system
            //  MM: "Myanmar", LR: "Liberia",  US: "United States"  
            if(myCountry == "US" || myCountry=="LR" || myCountry=="MM") {
               var units = "imperial";
            } else { var units = "metric"; }
            
            myWeather(lat, lon, units);

            countryNames();
            //convert the signature of your country to the full name
            function countryNames(){
               $.get(
                  "https://codepen.io/pablosv/pen/eWgzwO.js",  // a list of country names
                  function(Countries){
                     var qty = Object.keys(Countries).length;  //quantity of countries
                     for(var i = 0; i < qty; i++){
                        if (Object.keys(Countries)[i] == myCountry){
                           fullname = Countries[Object.keys(Countries)[i]];
                        }
                     }
                     $("#country").html(fullname);
                  }, "json"
               );  // end get country names

            }    // end function countryNames   
         }, "jsonp"
      );  // end get ipinfo      
      
   } // end function myLocation
   
   ////////////////////////////////////////////////////////////////
   // Get the current local weather API from OepnWeatherMap.org
   ////////////////////////////////////////////////////////////////
   
   function myWeather(lat, lon, units){
      var weatherjson;
      // get the weather json according to your location
      weatherjson = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units="+units+"&appid=e3685cd80af250dff079b263ff03b45f";
      console.log(weatherjson);
      $.get(
         weatherjson,
         function(theWeather) {
            console.log(theWeather);
            
           // Weather Icons
           //**************      
           var prefix = 'wi wi-';
           var status;
           var code = theWeather.weather[0].id;

           switch (true) {
              case code >= 200 && code < 300:
                 status = "thunderstorm";
                 break;
              case code >= 300 && code < 400:
                 status = "sprinkle";
                 break;
              // there's no 400's in openweathermap.org
              case code >= 500 && code < 600:
                 status = "rain";
                 break;
              case code >= 600 && code < 700:
                 status = "snow";
                 break;
              case code >= 700 && code < 800:
                 status = "fog";
                 break;
              case code == 800:
                 if (light = "day-"){
                    status = "sunny";
                 }
                 else {
                    status = "clear";
                 }
                 break;
              case code > 800 && code < 900:
                 status = "cloudy";
                 break;  
           }
            var icon = prefix + light + status;
            var iconBlock = "<i class='"+icon+"'></i>";
            $(".weather-icon").html(iconBlock);
            $(".weather-desc").html(theWeather.weather[0].main);
            
            // Temperatures
            //**************
            var myTemp = theWeather.main.temp;
            // Display temp units in ºC or ºF depending on the country
            var ctry = theWeather.sys.country;
            // Countries that don't use metric system
            //  MM: "Myanmar", LR: "Liberia",  US: "United States"  
            if(ctry=="US" || ctry=="LR" || ctry=="MM"){
               $("#temperature").html(myTemp+" ºF");
               $("#tempUnit").html("Change to Celsius");
            }
            else {
               $("#temperature").html(myTemp+" ºC");
               $("#tempUnit").html("Change to Farenheit");          
            }

           // On click convert ºF to ºC and vice versa
           //-------------------------------------------
           $("#tempUnit").on("click", function() {
              if (units=="imperial"){
                  units="metric";
                  myTemp = ((myTemp-32)*5)/9;
                  $("#temperature").html(myTemp.toFixed(2)+" ºC");
                  $("#tempUnit").html("Change to Farenheit");     
              }
              else {
                  units="imperial";
                  myTemp = ((myTemp.toFixed(2)*9)/5)+32;
                  $("#temperature").html(myTemp.toFixed(2)+" ºF");
                  $("#tempUnit").html("Change to Celsius");
              }
           })            
           

         }, "json"
      );
   }  // end function myWeather   
   
}); // end document.ready
