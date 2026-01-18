function loadPageCity(city, unit) {
    let apiKey = 't663e08fb6a44fe2c0f4395oce03be20';
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(changeTemperature);
}

function getLocalTime(lat, lon) {
    let apiKey = '01a39e21994c474c8af9a33ca6ce7e56';
    let apiUrl = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&lat=${lat}&long=${lon}`;
    axios.get(apiUrl).then(changeLocalTime);
}

function changeLocalTime(response) {
    // console.log(response.data);
    let responseDay = response.data.date_time_txt;
    let day = responseDay.split(',');
    let responseTime = response.data.time_24;
    let time = responseTime.split(':');
    let output = day[0] + ', ' + time[0] + ':' + time[1];
    let date = document.querySelector('#date');
    date.innerText = output;
}

function currentDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
}

function getForecast(latitude, longitude, unit) {
    // console.log(latitude, longitude, unit);
    let apiKey = 't663e08fb6a44fe2c0f4395oce03be20';
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayForecast);
}

function changeTemperature(response) {
    // console.log(response);
    let temperature = document.querySelector('#temperature');
    let cityHeading = document.querySelector('#city-heading');
    let skyCondition = document.querySelector('#sky-condition');
    let humidity = document.querySelector('#humidity');
    let windspeed = document.querySelector('#windspeed');
    let iconElement = document.querySelector('#icon');
    let updatedElement = document.querySelector('#updated');
    let unit = 'metric';

    temperature.innerHTML = Math.round(response.data.temperature.current);
    cityHeading.innerHTML = response.data.city;
    skyCondition.innerHTML = response.data.condition.description;
    humidity.innerHTML = response.data.temperature.humidity;
    windspeed.innerHTML = Math.round(response.data.wind.speed);
    iconElement.setAttribute('src', response.data.condition.icon_url);
    updatedElement.innerHTML = currentDate(response.data.time * 1000);

    if (fahrenheitButton.classList.value != 0) {
        unit = 'imperial';
    } else {
        unit = 'metric';
    }

    getLocalTime(response.data.coordinates.latitude, response.data.coordinates.longitude);
    checkWeather(response.data.condition.description);
    getForecast(response.data.coordinates.latitude, response.data.coordinates.longitude, unit);
}

function handleSubmit(event) {
    event.preventDefault();
    let city = document.querySelector('#city-input').value;
    loadPageCity(city, 'metric');
    celsiusButton.classList.add('active');
    fahrenheitButton.classList.remove('active');
}

function getPosition(position) {
    // console.log(position.coords);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = 't663e08fb6a44fe2c0f4395oce03be20';
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}`;
    axios.get(apiUrl).then(changeTemperature);
}

function startNavigator() {
    navigator.geolocation.getCurrentPosition(getPosition);
}

function changeToFahrenheit(event) {
    event.preventDefault();
    celsiusButton.classList.remove('active');
    fahrenheitButton.classList.add('active');
    document.querySelector('#windspeed-unit').innerHTML = 'm/h';
    loadPageCity(document.querySelector('#city-heading').innerText, 'imperial');
}

function changeToCelsius(event) {
    event.preventDefault();
    celsiusButton.classList.add('active');
    fahrenheitButton.classList.remove('active');
    document.querySelector('#windspeed-unit').innerHTML = 'm/s';
    loadPageCity(document.querySelector('#city-heading').innerText, 'metric');
}

function checkWeather(weather) {
    // console.log(weather);
    rainElement.classList.remove('rain', 'rainlightning');
    bodyElement.classList.remove('clear', 'dark', 'clouds', 'mist');
    snowflakesElement.style.visibility = 'hidden';
    if (weather == 'thunderstorm') {
        rainElement.classList.add('rainlightning');
        bodyElement.classList.add('dark');
    } else if (weather == 'rain' || weather == 'shower rain' || weather == 'light rain' || weather == 'moderate rain') {
        rainElement.classList.add('rain');
        bodyElement.classList.add('dark');
    } else if (weather == 'few clouds' || weather == 'scattered clouds' || weather == 'broken clouds') {
        bodyElement.classList.add('clouds');
    } else if (weather == 'mist') {
        bodyElement.classList.add('mist');
    } else if (weather == 'snow') {
        bodyElement.classList.add('mist');
        snowflakesElement.style.visibility = 'visible';
    } else {
        bodyElement.classList.add('clear');
    }
}

function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days[day];
}

function displayForecast(response) {
    // console.log(response.data.daily);
    let forecast = response.data.daily;
    let forecastElement = document.querySelector('#forecast');

    let forecastHTML = '<div class="row" id="forecast">';

    forecast.forEach(function (forecastDay, index) {
        if (index > 0 && index < 7) {
            forecastHTML += `<div class="col-2 forecast-day" id="forecast">
            <h4 class="day">
                <span>${formatForecastDay(forecastDay.time)}</span><br /><img src=${forecastDay.condition.icon_url} alt="" class="forecast-icon" />
                <br /><small>${Math.round(forecastDay.temperature.maximum)}°</small> <small class="forecastDegreesLow">${Math.round(
                    forecastDay.temperature.minimum,
                )}°</small>
            </h4>
        </div>`;
        }
    });
    forecastHTML += '</div>';
    forecastElement.innerHTML = forecastHTML;
}

let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSubmit);

let currentCityButton = document.querySelector('#current-city-button');
currentCityButton.addEventListener('click', startNavigator);

let fahrenheitButton = document.querySelector('#fahrenheit');
fahrenheitButton.addEventListener('click', changeToFahrenheit);

let celsiusButton = document.querySelector('#celsius');
celsiusButton.addEventListener('click', changeToCelsius);

let rainElement = document.querySelector('#rain');
let lightningElement = document.querySelector('#lightning');

let bodyElement = document.querySelector('body');

let snowflakesElement = document.querySelector('#snowflakes');
snowflakesElement.style.visibility = 'hidden';

loadPageCity('London', 'metric');
