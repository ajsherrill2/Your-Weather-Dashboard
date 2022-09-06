var cityFormEl = document.querySelector('#city-form');
var recentSearchesList = document.querySelector('#recent-searches');
var cityInputEl = document.querySelector('#city');
var forcastContainerEl = document.querySelector('#city-container');
var resultsPanel = document.querySelector('.results');

localStorage.clear();

function formSubmitHandler() {
    var cityName = $('#city')[0].value.trim();

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                $('city-name').textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";
                recentSearchesList.append('<button type="button">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLon = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLon);

                apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";
                console.log(apiUrl);

                fetch(apiUrl).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert('Could not find city!');
        }
    })
}