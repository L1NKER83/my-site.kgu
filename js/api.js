// Работа с API (погода в Москве)

document.addEventListener('DOMContentLoaded', () => {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.61&current_weather=true&hourly=temperature_2m,weathercode';

    function getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Ясно',
            1: 'Преимущественно ясно',
            2: 'Переменная облачность',
            3: 'Пасмурно',
            45: 'Туман',
            48: 'Туман с изморозью',
            51: 'Легкая морось',
            53: 'Умеренная морось',
            55: 'Сильная морось',
            61: 'Небольшой дождь',
            63: 'Умеренный дождь',
            65: 'Сильный дождь',
            71: 'Небольшой снег',
            73: 'Умеренный снег',
            75: 'Сильный снег',
            80: 'Небольшие ливни',
            81: 'Умеренные ливни',
            82: 'Сильные ливни'
        };
        return weatherCodes[code] || 'Неизвестно';
    }

    function getWeatherEmoji(code) {
        if (code === 0 || code === 1) return '☀️';
        if (code === 2 || code === 3) return '⛅';
        if (code >= 45 && code <= 48) return '🌫️';
        if (code >= 51 && code <= 55) return '🌧️';
        if (code >= 61 && code <= 65) return '☔';
        if (code >= 71 && code <= 75) return '❄️';
        if (code >= 80 && code <= 82) return '⛈️';
        return '🌈';
    }

    function getWeatherAdvice(temp, weatherCode) {
        const jokes = [
            "Отличная погода для прогулки! Если, конечно, вам не нужно работать.",
            "Идеально для того, чтобы сидеть дома и смотреть на курс доллара!",
            "Погода как настроение - постоянно меняется!",
            "На улице так хорошо, что даже доллар может улыбаться!",
            "Погода для чая и размышлений о финансовой стабильности!"
        ];

        if (temp > 25) {
            return "Жарко! Мороженое сегодня обязательно. И долларовый депозит для охлаждения.";
        } else if (temp < 0) {
            return "Холодно! Грейтесь горячим чаем и теплыми мыслями о росте акций.";
        } else if (weatherCode >= 61 && weatherCode <= 65) {
            return "Дождь! Прекрасная погода, чтобы остаться дома и следить за курсами.";
        } else {
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            const currentWeather = data.current_weather;
            const temperature = currentWeather.temperature;
            const weatherCode = currentWeather.weathercode;
            const windSpeed = currentWeather.windspeed;
            
            const weatherDescription = getWeatherDescription(weatherCode);
            const weatherEmoji = getWeatherEmoji(weatherCode);
            const advice = getWeatherAdvice(temperature, weatherCode);

            weatherInfo.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">${weatherEmoji}</div>
                <h3>Погода в Москве сейчас</h3>
                <div style="font-size: 2.5rem; font-weight: bold; margin: 1rem 0;">${temperature}°C</div>
                <p><strong>Состояние:</strong> ${weatherDescription}</p>
                <p><strong>Скорость ветра:</strong> ${windSpeed} км/ч</p>
                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.2); border-radius: 10px;">
                    <p><strong>Совет от нашего финансового эксперта:</strong></p>
                    <p>${advice}</p>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                    <i class="fas fa-info-circle"></i> Данные обновлены: ${new Date().toLocaleTimeString('ru-RU')}
                </p>
            `;
        })
        .catch(error => {
            console.error('Ошибка при получении данных о погоде:', error);
            weatherInfo.innerHTML = `
                <div style="color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Не удалось загрузить данные о погоде</h3>
                    <p>Возможно, погода решила взять выходной, как и курс доллара вчера!</p>
                    <p>Попробуйте обновить страницу или представьте, что на улице +25°C и солнечно! ☀️</p>
                </div>
            `;
        });

    // Автоматическое обновление каждые 5 минут
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            location.reload();
        }
    }, 300000);
});