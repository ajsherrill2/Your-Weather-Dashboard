var cityFormEl = document.querySelector('#city-form');
var recentSearchesList = document.querySelector('#recent-searches');
var cityInputEl = document.querySelector('#city');
var forcastContainerEl = document.querySelector('#city-container');
var resultsPanel = document.querySelector('.results');
var weatherForcastEl = document.getElementById('weather-forcast');


localStorage.clear();

function formSubmitHandler() {
    var cityName = $('#city')[0].value.trim();

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                $('#city-name')[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";
                
                $(recentSearchesList).append(
                    $(document.createElement('button')).prop({
                        type: 'button',
                        innerHTML: cityName,
                        class: 'list-group-item list-group-item-light list-group-item-action recents-btn',
                    })
                );

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLon = lat.toString() + " " + lon.toString();
        
                localStorage.setItem(cityName, latLon);
                
                let uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";

                fetch(uvApiUrl).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (uvData) {
                            getCurrentWeather(data, uvData);
                        })
                    }
                })

                forcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc'

                fetch(forcastUrl).then(function (forcastResponse) {
                    if (forcastResponse.ok) {
                        forcastResponse.json().then(function (data) {
                            for (let i = 0; i < 5; i++) {
                                $('.day')[i].textContent = data.list[i].dt;
                                $('.img')[i].src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
                                $('.temp')[i].textContent = data.list[i].main.temp;
                                $('.hum')[i].textContent = data.list[i].main.humidity;
                            }
                        });
                    }
                });

            })
        } else {
            alert('Could not find city!');
        }
    });
}

function getCurrentWeather(data, uvData) {
    $(resultsPanel).addClass('visible')

    $("#current-icon")[0].src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    $("#temp")[0].textContent = "Temperature: " + data.main.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.main.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.wind.speed.toFixed(1) + " MPH";
    $("#uv-index")[0].textContent = "  " + uvData.value;

    if (uvData.value < 3) {
        $("#uv-index").removeClass("moderate severe");
        $("#uv-index").addClass("favorable");
    } else if (uvData.value < 6) {
        $("#uv-index").removeClass("favorable severe");
        $("#uv-index").addClass("moderate");
    } else {
        $("#uv-index").removeClass("favorable moderate");
        $("#uv-index").addClass("severe");
    }
}

function getFiveDayForcast(forcastData) {

}

$('#city-form').on('submit', function (e) {
    e.preventDefault();

    formSubmitHandler();

    $("form")[0].reset();
})

$('.city-list-box').on('click', '.recents-btn', function() {

    formSubmitHandler()
})