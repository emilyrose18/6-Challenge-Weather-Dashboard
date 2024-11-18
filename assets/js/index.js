// Weather api key and query url
const APIKey = "7df12cb46de7a3afe299788affb9ac22";
const queryURL = `api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}`

//Search input, search button, city button, and weather info
const form = document.getElementById ('searchBar');
const input = document.querySelector('input[type="search"]');
const weatherInfo = document.querySelector('#weather-info');
const cityBtnContainer = document.getElementById('cityBtn');

//Search bar function code + Current weather
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const cityName = input.value.trim();

    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`;

    fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

//Five Day weather fetch
    const queryURLForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=imperial`;

    fetch(queryURLForecast)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

//Current day weather information
function displayWeather(weatherData) {
    const cityName = weatherData.name;
    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    const weatherInfoHtml = `
        <h5 class="card-title">${cityName}</h5>
        <p class="card-text">
            <ul>
                <li>Temperature: ${temperature}°F</li>
                <li>Wind: ${windSpeed} m/s</li>
                <li>Humidity: ${humidity}%</li>
            </ul>
        </p>
    `;
    weatherInfo.innerHTML = weatherInfoHtml;
}

// 5 Day weather forecast
function displayForecast(forecastData) {
    const forecastList = forecastData.list;
    const fiveDayForecast = forecastList.filter((forecast, index) => index % 8 === 0);
    console.log(fiveDayForecast);

    const forecastCardsHtml = fiveDayForecast.map(forecast => {
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const weatherDescription = forecast.weather[0].description;

        //FixMe: add card back from html and put classes to match below
        const forecastInfoHtml = `
        <h5 class="card-title">${date.toDateString()}</h5>
        <p class="card-text">
            <ul>
                <li>Temperature: ${temperature}°F</li>
                <li>Weather:${weatherDescription}%</li>
            </ul>
        </p>
    `;
    return forecastInfoHtml
    }).join('');
    const forecastContainer = document.querySelector('#fiveDay');
    forecastContainer.innerHTML = forecastCardsHtml;
}


//Local Storage
function saveToSearchHistory(cityName) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (!savedCities.includes(cityName)) {
        savedCities.push(cityName);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

function getSavedToSearchHistory() {
    return JSON.parse(localStorage.getItem('savedCities')) || [];
}

window.addEventListener('load', function() {
    const savedCities = getSavedToSearchHistory();
});

form.addEventListener('submit', function(event){
    event.preventDefault();
    const cityName = input.value.trim();

    saveToSearchHistory(cityName);
});

//Search History Buttons
//FixMe: Need to program the buttons to display weather information when clicked
function createCityButton(cityName) {
    const button = document.createElement('button');
    button.textContent = cityName;
    button.addEventListener('click', () => {
        displayWeather(cityName);
        displayForecast(cityName);
    });

    cityBtnContainer.appendChild(button);
}

function loadSavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCities.forEach(cityName => {
        createCityButton(cityName);
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = input.value.trim();
    saveToSearchHistory(cityName);
    displayWeather(cityName);
    displayForecast(cityName);
});

window.addEventListener('load', loadSavedCities);
