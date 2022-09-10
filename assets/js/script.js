// Main variables
let cityFormEl = $('#city-form');
let cityInputEl = $('#city');
let searchedCity = $('#city-name');
let resultsPanel = $('.results')
let recentSearchesList = $('#recent-searches');

// Searches input in Open Weather Map 2.5 APi and prints specific weather data
function formSubmitHandler(results) {
    var cityName = $(cityInputEl)[0].value.trim() || results;

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=073e596cca8ed71b557304d86f8bfbdc";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                $(searchedCity)[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";
                
                // This Adds a button once the city is searched but only if the button doesnt already exist
                let recentCityBtn = document.getElementById(cityName);
                if (recentCityBtn) {
                    this.document.getElementById(cityName).remove();
                    $(recentSearchesList).append(
                        $(document.createElement('button')).prop({
                            type: 'button',
                            innerHTML: cityName,
                            class: 'list-group-item recents-btn',
                            id: cityName,
                        })
                    );
                } else {
                    $(recentSearchesList).append(
                        $(document.createElement('button')).prop({
                            type: 'button',
                            innerHTML: cityName,
                            class: 'list-group-item recents-btn',
                            id: cityName,
                        })
                    );
                }
                

                const lat = data.coord.lat;
                const lon = data.coord.lon;
                
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
                            getFiveDayForcast(data);
                        });
                    }
                });

            })
        } else {
            alert('Could not find city!');
        }
    });
}

// Gets the current weather for present day and adds text content to results
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

// Gets data from Open Weather Map Five-day Forcast and shows results
function getFiveDayForcast(data) {
    for ( let i = 0; i < 5; i++) {
        $('.day')[i].textContent = moment(data.list[i*8].dt*1000).format('dddd M/D');
        $('.img')[i].src = "http://openweathermap.org/img/wn/" + data.list[i*8].weather[0].icon + "@2x.png";
        $('.temp')[i].textContent = 'Temp: ' + data.list[i*8].main.temp.toFixed(1) + " \u2109";
        $('.wind')[i].textContent = 'Wind Speed: ' + data.list[i*8].wind.speed.toFixed(1) + ' MPH';
        $('.hum')[i].textContent = 'Humidity: ' + data.list[i*8].main.humidity + "% ";
    }
}

// Event listener for the form search button
$(cityFormEl).on('submit', function (e) {
    e.preventDefault();

    formSubmitHandler();

    $("form")[0].reset();
})

// TO DO:
// Event listener for recently searched city buttons
$(recentSearchesList).on('click', '.recents-btn', function() {
    var cityName = this.innerHTML;

    formSubmitHandler(cityName);
})