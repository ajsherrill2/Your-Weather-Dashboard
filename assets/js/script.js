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

function getRecentSearch(coordinates) {
    apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather();
            })
        }
    })
}

function getCurrentWeather(data) {
    $(resultsPanel).addClass('visible')

    // $("#current-icon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    $("#temp")[0].textContent = "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    // $("#uv-index")[0].textContent = "  " + data.current.uvi;

    getCityForcast();
}

$('#city-form').on('submit', function (e) {
    e.preventDefault();

    formSubmitHandler();

    $("form")[0].reset();
})

$('.city-list-box').on('click', 'recents-btn', function () {
    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(' ');
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $('#city-name')[0].textContent = $(this).textContent + " (" + moment().format('M/D/YYYY') + ")";

    getRecentSearch(coordinates);
})