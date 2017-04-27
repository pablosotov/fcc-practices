// get city, country and localization
$(document).ready(function() {

  myLocation();  //create function to identify your location city and country
  function myLocation(){
    var coordenates, lat, lon;
    var myCountry;
    $.get(
      "https://ipinfo.io",
      function(location,fullname) {

        //console.log(location);
        coordenates = location.loc.split(",");
        lat = coordenates[0];
        lon = coordenates[1];
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
                  console.log(fullname);
                }
              }
             $("#country").html(fullname);
            }, "json"
            
          );
        }    // end function countryNames   
      }, "jsonp"
    );
  }



  
  ////////////////////////
  


  function myWeather(lat, lon){
    // get the weather json according to your location
    var weatherjson = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid=e3685cd80af250dff079b263ff03b45f";
    //console.log(weatherjson);
    
    $.get(weatherjson, function(weather) {
      //console.log(weather);
      $("#temperature").html(weather.main.temp+" ºC");
    }, "jsonp");
    
  }  
}); // end document.ready

