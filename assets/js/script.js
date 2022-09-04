var cityFormEl = document.querySelector('#city-form');
var recentSearchesList = document.querySelector('#recent-searches');
var cityInputEl = document.querySelector('#city');
var forcastContainerEl = document.querySelector('#city-container');
var citySearch = document.querySelector('#city-search');

var formSubmitHandler = function (event) {
    event.preventDefault();
    
    var city = cityInputEl.value.trim();
    console.log(city);

    if (city) {
        getCityForcast(city);

        forcastContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
}

$(cityFormEl).on('submit', formSubmitHandler);