// get city, country and localization
$(document).ready(function() {

  myLocation();  //create function to identify your location city and country
  function myLocation(){
    var coordenates; 
    var myCountry;
    $.get(
      "https://ipinfo.io",
      function(location,fullname) {

        //console.log(location);
        coordenates = location.loc.split(",");
        var lat = coordenates[0];
        var lon = coordenates[1];
        myWeather(lat, lon);
        myCountry = location.country;
        $("#location").html(location.city+", "+location.region); 
        
        // Countries that don't use metric system
        //  MM: "Myanmar", LR: "Liberia",  US: "United States"  
        countryNames();
        //convert the signature of your country to the full name
        function countryNames(){
          $.get(
            "https://codepen.io/pablosv/pen/eWgzwO.js",
            function(Countries){
              var qty = Object.keys(Countries).length;
             
              for(var i = 0; i < qty; i++){
                if (Object.keys(Countries)[i] == myCountry){
                  fullname = Countries[Object.keys(Countries)[i]];
                  //console.log(fullname);
                }
              }
             $("#country").html(fullname);
            }, "json"
          );  // end get country names
        }    // end function countryNames   
       
      }, "jsonp"
      
    );  // end get ipinfo
     
  } // end function myLocation
  
  var weatherjson;
  function myWeather(lat, lon){
    // get the weather json according to your location
    weatherjson = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid=e3685cd80af250dff079b263ff03b45f";
    
    $.get(
        weatherjson,
        function(theWeather) {
          console.log(theWeather);
          $("#temperature").html(theWeather.main.temp+" ºC");

          var prefix = 'wi wi-';
          var code = theWeather.weather[0].id;
          console.log(code);
          var icon = theWeather.weather[code].icon;
          console.log(theWeather.weather[0].id);
          
          // If we are not in the ranges mentioned above, add a day/night prefix.
          if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
            icon = 'day-' + icon;
          }

          // Finally tack on the prefix.
          icon = prefix + icon;
          console.log(icon);
          
        }, "jsonp"
    );

  }  // end function myWeather




  
}); // end document.ready

