document.addEventListener("DOMContentLoaded", () => {

    const apiKey = "270552f26828ff5b5411197828fdc305";

    const cityInput = document.getElementById("cityInput");
    const getWeatherBtn = document.getElementById("getWeatherBtn");

    const weatherResult = document.getElementById("weatherResult");
    const errorMessage = document.getElementById("errorMessage");

    const loader = document.getElementById("loader");
    const welcomeScreen = document.getElementById("welcomeScreen");

    const languageSelect =
        document.getElementById("languageSelect");


    /* =========================
       TRANSLATIONS
    ========================== */

    const translations = {

        uz: {
            subtitle: "Ob-havo ma'lumotlari",

            placeholder:
                "Shahar nomini kiriting...",

            search: "Qidirish",

            loading:
                "Ob-havo yuklanmoqda...",

            currentWeather:
                "Hozirgi ob-havo",

            feelsLike:
                "His qilinishi:",

            humidity:
                "Namlik",

            wind:
                "Shamol",

            pressure:
                "Bosim",

            visibility:
                "Ko'rinish",

            sunrise:
                "Quyosh chiqishi",

            sunset:
                "Quyosh botishi",

            welcomeTitle:
                "Ob-havoni tekshiring",

            welcomeText:
                "Istalgan shahar nomini kiriting va joriy ob-havo ma'lumotlarini oling.",

            emptyCity:
                "Iltimos, shahar nomini kiriting.",

            cityNotFound:
                "Shahar topilmadi.",

            error:
                "Xatolik yuz berdi. Qayta urinib ko'ring."
        },


        en: {
            subtitle:
                "Weather information",

            placeholder:
                "Enter city name...",

            search:
                "Search",

            loading:
                "Loading weather...",

            currentWeather:
                "Current weather",

            feelsLike:
                "Feels like:",

            humidity:
                "Humidity",

            wind:
                "Wind",

            pressure:
                "Pressure",

            visibility:
                "Visibility",

            sunrise:
                "Sunrise",

            sunset:
                "Sunset",

            welcomeTitle:
                "Check the weather",

            welcomeText:
                "Enter any city to get the latest weather information.",

            emptyCity:
                "Please enter a city name.",

            cityNotFound:
                "City not found.",

            error:
                "Something went wrong. Please try again."
        },


        ru: {
            subtitle:
                "Информация о погоде",

            placeholder:
                "Введите название города...",

            search:
                "Поиск",

            loading:
                "Загрузка погоды...",

            currentWeather:
                "Текущая погода",

            feelsLike:
                "Ощущается как:",

            humidity:
                "Влажность",

            wind:
                "Ветер",

            pressure:
                "Давление",

            visibility:
                "Видимость",

            sunrise:
                "Восход",

            sunset:
                "Закат",

            welcomeTitle:
                "Узнайте погоду",

            welcomeText:
                "Введите название города, чтобы получить актуальную информацию о погоде.",

            emptyCity:
                "Введите название города.",

            cityNotFound:
                "Город не найден.",

            error:
                "Произошла ошибка. Попробуйте снова."
        }

    };


    let currentLanguage = "uz";


    /* =========================
       LANGUAGE
    ========================== */

    function changeLanguage(language) {

        currentLanguage = language;

        const text = translations[language];

        document.documentElement.lang = language;

        document.getElementById("subtitle")
            .textContent = text.subtitle;

        cityInput.placeholder =
            text.placeholder;

        document.getElementById("searchButtonText")
            .textContent = text.search;

        document.getElementById("loadingText")
            .textContent = text.loading;

        document.getElementById("currentWeatherText")
            .textContent = text.currentWeather;

        document.getElementById("feelsLikeLabel")
            .textContent = text.feelsLike;

        document.getElementById("humidityLabel")
            .textContent = text.humidity;

        document.getElementById("windLabel")
            .textContent = text.wind;

        document.getElementById("pressureLabel")
            .textContent = text.pressure;

        document.getElementById("visibilityLabel")
            .textContent = text.visibility;

        document.getElementById("sunriseLabel")
            .textContent = text.sunrise;

        document.getElementById("sunsetLabel")
            .textContent = text.sunset;

        document.getElementById("welcomeTitle")
            .textContent = text.welcomeTitle;

        document.getElementById("welcomeText")
            .textContent = text.welcomeText;
    }


    languageSelect.addEventListener(
        "change",
        (event) => {

            changeLanguage(event.target.value);

        }
    );


    /* =========================
       SEARCH
    ========================== */

    getWeatherBtn.addEventListener(
        "click",
        getWeather
    );


    cityInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {
                getWeather();
            }

        }
    );


    /* =========================
       GET WEATHER
    ========================== */

    async function getWeather() {

        const city =
            cityInput.value.trim();

        if (!city) {

            showError(
                translations[currentLanguage]
                    .emptyCity
            );

            return;
        }


        showLoader();


        try {

            const url =
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=${currentLanguage}&appid=${apiKey}`;


            const response =
                await fetch(url);


            if (!response.ok) {

                if (response.status === 404) {

                    throw new Error(
                        "CITY_NOT_FOUND"
                    );

                }

                throw new Error(
                    "API_ERROR"
                );
            }


            const data =
                await response.json();


            displayWeather(data);


        } catch (error) {

            hideLoader();


            if (
                error.message ===
                "CITY_NOT_FOUND"
            ) {

                showError(
                    translations[
                        currentLanguage
                    ].cityNotFound
                );

            } else {

                showError(
                    translations[
                        currentLanguage
                    ].error
                );

            }

        }

    }


    /* =========================
       DISPLAY WEATHER
    ========================== */

    function displayWeather(data) {

        hideLoader();

        errorMessage.classList.add(
            "hidden"
        );

        welcomeScreen.classList.add(
            "hidden"
        );

        weatherResult.classList.remove(
            "hidden"
        );


        document.getElementById(
            "cityName"
        ).textContent =
            `${data.name}, ${data.sys.country}`;


        document.getElementById(
            "temperature"
        ).textContent =
            Math.round(data.main.temp);


        document.getElementById(
            "description"
        ).textContent =
            data.weather[0].description;


        document.getElementById(
            "feelsLike"
        ).textContent =
            Math.round(
                data.main.feels_like
            );


        document.getElementById(
            "humidity"
        ).textContent =
            `${data.main.humidity}%`;


        document.getElementById(
            "windSpeed"
        ).textContent =
            `${data.wind.speed} m/s`;


        document.getElementById(
            "pressure"
        ).textContent =
            `${data.main.pressure} hPa`;


        const visibility =
            data.visibility / 1000;


        document.getElementById(
            "visibility"
        ).textContent =
            `${visibility.toFixed(1)} km`;


        /* WEATHER ICON */

        const icon =
            data.weather[0].icon;

        document.getElementById(
            "weatherIcon"
        ).src =
            `https://openweathermap.org/img/wn/${icon}@4x.png`;


        /* SUNRISE */

        document.getElementById(
            "sunrise"
        ).textContent =
            formatTime(
                data.sys.sunrise,
                data.timezone
            );


        /* SUNSET */

        document.getElementById(
            "sunset"
        ).textContent =
            formatTime(
                data.sys.sunset,
                data.timezone
            );


        /* DATE */

        updateDate(
            data.timezone
        );


        /* BACKGROUND */

        changeWeatherBackground(
            data.weather[0].main
        );

    }



    function updateDate(timezone) {

        const utcMilliseconds =
            Date.now() +
            new Date()
                .getTimezoneOffset()
                * 60000;

        const cityDate =
            new Date(
                utcMilliseconds +
                timezone * 1000
            );


        const locales = {

            uz: "uz-UZ",

            en: "en-US",

            ru: "ru-RU"

        };


        const formatted =
            cityDate.toLocaleDateString(
                locales[currentLanguage],
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        document.getElementById(
            "currentDate"
        ).textContent =
            formatted;
    }



    function formatTime(
        timestamp,
        timezone
    ) {

        const date =
            new Date(
                (timestamp + timezone)
                * 1000
            );


        return date
            .toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC"
                }
            );

    }



    function changeWeatherBackground(
        weather
    ) {

        document.body.className = "";


        const weatherName =
            weather.toLowerCase();


        if (
            weatherName.includes(
                "clear"
            )
        ) {

            document.body.classList.add(
                "weather-clear"
            );

        }

        else if (
            weatherName.includes(
                "cloud"
            )
        ) {

            document.body.classList.add(
                "weather-clouds"
            );

        }

        else if (
            weatherName.includes(
                "rain"
            ) ||
            weatherName.includes(
                "drizzle"
            )
        ) {

            document.body.classList.add(
                "weather-rain"
            );

        }

        else if (
            weatherName.includes(
                "snow"
            )
        ) {

            document.body.classList.add(
                "weather-snow"
            );

        }

        else if (
            weatherName.includes(
                "thunderstorm"
            )
        ) {

            document.body.classList.add(
                "weather-thunderstorm"
            );

        }

        else {

            document.body.classList.add(
                "weather-default"
            );

        }

    }


    /* =========================
       LOADING
    ========================== */

    function showLoader() {

        errorMessage.classList.add(
            "hidden"
        );

        weatherResult.classList.add(
            "hidden"
        );

        welcomeScreen.classList.add(
            "hidden"
        );

        loader.classList.remove(
            "hidden"
        );

    }


    function hideLoader() {

        loader.classList.add(
            "hidden"
        );

    }



    function showError(message) {

        hideLoader();

        weatherResult.classList.add(
            "hidden"
        );

        errorMessage.textContent =
            message;

        errorMessage.classList.remove(
            "hidden"
        );

    }



    changeLanguage("uz");

});


























































// document.addEventListener('DOMContentLoaded', () => {
//     const apiKey = '270552f26828ff5b5411197828fdc305';
//     const getWeatherBtn = document.getElementById('getWeatherBtn');
//     const cityInput = document.getElementById('cityInput');
//     const weatherResult = document.getElementById('weatherResult');
//     const errorMessage = document.getElementById('errorMessage');
    

 

//     getWeatherBtn.addEventListener('click', () => {
//         const city = cityInput.value.trim();
//         if (city === '') {
//             errorMessage.textContent = 'Iltimos shaharingiz nomini kiriting.';
//             errorMessage.classList.remove('hidden');
//             weatherResult.classList.add('hidden');
//             return;
//         }
        
//         fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.cod === '404') {
//                     errorMessage.textContent = 'City not found.';
//                     errorMessage.classList.remove('hidden');
//                     weatherResult.classList.add('hidden');
//                 } else {
//                     errorMessage.classList.add('hidden');
//                     weatherResult.classList.remove('hidden');
//                     document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
//                     document.getElementById('temperature').textContent = `Temperatura: ${data.main.temp}°C`;
//                     document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
//                     document.getElementById('humidity').textContent = `Namlik: ${data.main.humidity}%`;
//                     document.getElementById('windSpeed').textContent = `Shamol esishi: ${data.wind.speed} m/s`;
                    
                   
//                 }
//             })
//             .catch(_error => {
//                 errorMessage.textContent = 'An error occurred. Please try again.';
//                 errorMessage.classList.remove('hidden');
//                 weatherResult.classList.add('hidden');
//             });
//     });
// });
