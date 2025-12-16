// Работа с внешним API для получения данных о погоде

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элемент для вывода данных
    const apiDataElement = document.getElementById('api-data');
    
    if (apiDataElement) {
        // Показываем индикатор загрузки
        apiDataElement.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Загрузка данных о погоде...</p>
            </div>
        `;
        
        // Получаем данные о погоде в Москве
        fetchWeatherData();
    }
});

// Функция для получения данных о погоде
async function fetchWeatherData() {
    try {
        // Используем API Open-Meteo для получения погоды в Москве
        // Широта и долгота Москвы: 55.7558° N, 37.6173° E
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=Europe/Moscow');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Ошибка при получении данных о погоде:', error);
        displayError();
    }
}

// Функция для отображения данных о погоде
function displayWeatherData(weatherData) {
    const apiDataElement = document.getElementById('api-data');
    
    if (!apiDataElement) return;
    
    const currentWeather = weatherData.current_weather;
    const hourlyData = weatherData.hourly;
    
    // Находим индекс текущего часа
    const currentTime = new Date(currentWeather.time);
    const currentHour = currentTime.getHours();
    
    // Получаем данные для следующих 6 часов
    const nextHours = [];
    for (let i = 0; i < 6; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex < hourlyData.time.length) {
            nextHours.push({
                time: new Date(hourlyData.time[hourIndex]).getHours() + ':00',
                temperature: hourlyData.temperature_2m[hourIndex],
                humidity: hourlyData.relativehumidity_2m[hourIndex],
                windspeed: hourlyData.windspeed_10m[hourIndex]
            });
        }
    }
    
    // Определяем описание погоды по коду
    const weatherCode = currentWeather.weathercode;
    const weatherDescription = getWeatherDescription(weatherCode);
    
    // Определяем иконку погоды
    const weatherIcon = getWeatherIcon(weatherCode);
    
    // Форматируем данные для отображения
    apiDataElement.innerHTML = `
        <div class="weather-data">
            <div class="weather-current">
                <div class="weather-icon">
                    <i class="${weatherIcon}"></i>
                </div>
                <div class="weather-main">
                    <h3>Погода в Москве сейчас</h3>
                    <div class="temperature">
                        ${currentWeather.temperature}°C
                    </div>
                    <div class="weather-description">
                        ${weatherDescription}
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <i class="fas fa-wind"></i>
                            <span>Ветер: ${currentWeather.windspeed} км/ч</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-compass"></i>
                            <span>Направление: ${getWindDirection(currentWeather.winddirection)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="weather-forecast">
                <h4>Прогноз на ближайшие часы:</h4>
                <div class="hourly-forecast">
                    ${nextHours.map(hour => `
                        <div class="hour-item">
                            <div class="hour-time">${hour.time}</div>
                            <div class="hour-temp">${hour.temperature}°C</div>
                            <div class="hour-details">
                                <small>Влажность: ${hour.humidity}%</small>
                                <small>Ветер: ${hour.windspeed} км/ч</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="api-info">
                <p><small>Данные предоставлены API <a href="https://open-meteo.com/" target="_blank">Open-Meteo.com</a></small></p>
            </div>
        </div>
    `;
    
    // Добавляем стили для отображения погоды
    addWeatherStyles();
}

// Функция для определения описания погоды по коду
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Ясно',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Изморозь',
        51: 'Легкая морось',
        53: 'Умеренная морось',
        55: 'Сильная морось',
        56: 'Легкая ледяная морось',
        57: 'Сильная ледяная морось',
        61: 'Небольшой дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        66: 'Ледяной дождь',
        67: 'Сильный ледяной дождь',
        71: 'Небольшой снег',
        73: 'Умеренный снег',
        75: 'Сильный снег',
        77: 'Снежные зерна',
        80: 'Небольшие ливни',
        81: 'Умеренные ливни',
        82: 'Сильные ливни',
        85: 'Небольшие снегопады',
        86: 'Сильные снегопады',
        95: 'Гроза',
        96: 'Гроза с небольшим градом',
        99: 'Гроза с сильным градом'
    };
    
    return weatherCodes[code] || 'Неизвестные условия';
}

// Функция для определения иконки погоды по коду
function getWeatherIcon(code) {
    if (code === 0 || code === 1) return 'fas fa-sun';
    if (code === 2) return 'fas fa-cloud-sun';
    if (code === 3) return 'fas fa-cloud';
    if (code >= 45 && code <= 57) return 'fas fa-smog';
    if (code >= 61 && code <= 67) return 'fas fa-cloud-rain';
    if (code >= 71 && code <= 77) return 'fas fa-snowflake';
    if (code >= 80 && code <= 82) return 'fas fa-cloud-showers-heavy';
    if (code >= 85 && code <= 86) return 'fas fa-snowflake';
    if (code >= 95 && code <= 99) return 'fas fa-bolt';
    return 'fas fa-question';
}

// Функция для определения направления ветра
function getWindDirection(degrees) {
    if (degrees >= 337.5 || degrees < 22.5) return 'Северный';
    if (degrees >= 22.5 && degrees < 67.5) return 'Северо-восточный';
    if (degrees >= 67.5 && degrees < 112.5) return 'Восточный';
    if (degrees >= 112.5 && degrees < 157.5) return 'Юго-восточный';
    if (degrees >= 157.5 && degrees < 202.5) return 'Южный';
    if (degrees >= 202.5 && degrees < 247.5) return 'Юго-западный';
    if (degrees >= 247.5 && degrees < 292.5) return 'Западный';
    if (degrees >= 292.5 && degrees < 337.5) return 'Северо-западный';
    return 'Неизвестно';
}

// Функция для отображения ошибки
function displayError() {
    const apiDataElement = document.getElementById('api-data');
    
    if (!apiDataElement) return;
    
    apiDataElement.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Не удалось загрузить данные о погоде</h3>
            <p>Пожалуйста, проверьте подключение к интернету и попробуйте обновить страницу.</p>
            <button onclick="fetchWeatherData()" class="retry-btn">
                <i class="fas fa-redo"></i> Попробовать снова
            </button>
        </div>
    `;
}

// Функция для добавления стилей для отображения погоды
function addWeatherStyles() {
    if (!document.getElementById('weather-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'weather-styles';
        styleElement.textContent = `
            .weather-data {
                width: 100%;
            }
            
            .weather-current {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .weather-icon {
                font-size: 3.5rem;
                color: #3498db;
            }
            
            .weather-main h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .temperature {
                font-size: 2.5rem;
                font-weight: 700;
                color: #e74c3c;
                margin-bottom: 5px;
            }
            
            .weather-description {
                font-size: 1.2rem;
                color: #666;
                margin-bottom: 15px;
            }
            
            .weather-details {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .detail-item {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #666;
            }
            
            .detail-item i {
                color: #3498db;
            }
            
            .weather-forecast h4 {
                margin-bottom: 15px;
                color: #2c3e50;
            }
            
            .hourly-forecast {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .hour-item {
                flex: 1;
                min-width: 120px;
                background: white;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            }
            
            .hour-time {
                font-weight: 600;
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .hour-temp {
                font-size: 1.5rem;
                font-weight: 700;
                color: #e74c3c;
                margin-bottom: 10px;
            }
            
            .hour-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 0.85rem;
                color: #666;
            }
            
            .api-info {
                text-align: center;
                color: #999;
                font-size: 0.9rem;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .api-info a {
                color: #3498db;
                text-decoration: none;
            }
            
            .api-info a:hover {
                text-decoration: underline;
            }
            
            .error-message {
                text-align: center;
                padding: 20px;
            }
            
            .error-message i {
                font-size: 3rem;
                color: #e74c3c;
                margin-bottom: 15px;
            }
            
            .error-message h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .error-message p {
                color: #666;
                margin-bottom: 20px;
            }
            
            .retry-btn {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                transition: background-color 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .retry-btn:hover {
                background-color: #2980b9;
            }
            
            @media (max-width: 768px) {
                .weather-current {
                    flex-direction: column;
                    text-align: center;
                }
                
                .weather-details {
                    justify-content: center;
                }
                
                .hour-item {
                    min-width: calc(50% - 15px);
                }
            }
            
            @media (max-width: 480px) {
                .hour-item {
                    min-width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
}