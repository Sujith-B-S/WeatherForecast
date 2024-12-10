var weatherInfoObj = {};

window.addEventListener("load" , () => {
    //Logic toread the coordinates

    var apiKey = 'Q5Utxm68wVPvzq1xMsBwekCCkh9Js3r0';
    var lat , long;
    var country,locationKey,timeZone,locationName;
    navigator.geolocation.getCurrentPosition((position) => {
        
        lat = position['coords']['latitude'];
        long = position['coords']['longitude'];
        console.log(lat,long);
        var geopositionUrl =`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`;
        console.log(geopositionUrl);
        axios.get(geopositionUrl)
        .then((res) =>{


            weatherInfoObj['country'] = res.data.Country.EnglishName;
            weatherInfoObj['locationKey'] = res.data.Key;
            weatherInfoObj['timeZone'] = res.data.TimeZone;
            weatherInfoObj['locationName'] = res.data.LocalizedName;
            console.log("@!@!",weatherInfoObj);
            getWeatherData(apiKey,weatherInfoObj.locationKey);
            
        })
        
    })
})

function getWeatherData(apiKey,locationKey){
    var weatherUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`;
    console.log(weatherUrl);
    axios.get(weatherUrl).then((response) => {
        console.log(response);
        weatherInfoObj['today'] = response.data.DailyForecasts[0].Date;
        weatherInfoObj['day'] = response.data.DailyForecasts[0].Day;
        weatherInfoObj['night'] = response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature'] = response.data.DailyForecasts[0].Temperature;
        var today = new Date(weatherInfoObj['today']);
        

        console.log(weatherInfoObj);

        returnId("country").textContent = weatherInfoObj["country"];
        returnId("currentLocation").textContent = weatherInfoObj['locationName'];
        returnId("date").textContent = today.getDate()+'-'+(today.getMonth()+1)+"-"+today.getFullYear()+"    "+weatherInfoObj.timeZone.Code;
         
        if(weatherInfoObj.day.Icon < 10)
        {
            returnId("morning").setAttribute("src",`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`);
        }
        else{
            returnId("morning").setAttribute("src",`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`);
        }
        if(weatherInfoObj.night.Icon < 10)
        {
            returnId("night").setAttribute("src",`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`);
        }
        else{
            returnId("night").setAttribute("src",`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`);
        }

        returnId("morning-desc").textContent =weatherInfoObj.day.IconPhrase;
        returnId("night-desc").textContent = weatherInfoObj.night.IconPhrase;
        returnId("max-temperature").textContent = weatherInfoObj.temperature.Maximum.Value+" Farenheit";
        returnId("min-temperature").textContent = weatherInfoObj.temperature.Minimum.Value+" Farenheit";
    })
    return {};
}

function returnId(id){
    return document.getElementById(id);
}

