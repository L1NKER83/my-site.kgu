// Основной JS файл для общего функционала сайта

document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Закрыть меню при клике на ссылку
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });

        // Закрыть меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }

    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Симуляция отправки
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Спасибо за сообщение! Мы ответим вам, как только доллар упадет (или вырастет, мы уже запутались).');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // Добавляем текущий год в футер
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('footer p');
    copyrightElements.forEach(el => {
        el.innerHTML = el.innerHTML.replace('2023', currentYear);
    });

    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Добавляем эффект при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            header.style.padding = '0.5rem 0';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            header.style.padding = '1rem 0';
        }
    });

    // Случайная шутка при загрузке
    const jokes = [
        "Почему доллар боится евро? Потому что у того два нуля!",
        "Что говорит рубль доллару? 'Подожди меня, я тоже хочу вырасти!'",
        "Как называется кошелек программиста? Баг-джед",
        "Почему финансисты плохие пловцы? Они всегда думают о том, как бы не утонуть в долгах!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    console.log(`Шутка дня: ${randomJoke}`);
    // Функция для обновления курсов валют
function updateExchangeRates() {
    const updateBtn = document.getElementById('update-rates');
    const updateTime = document.getElementById('update-time');
    const usdRate = document.getElementById('usd-rate');
    const usdChange = document.getElementById('usd-change');
    
    if (!updateBtn || !updateTime) return;
    
    // Показываем анимацию обновления
    updateBtn.classList.add('updating');
    updateBtn.disabled = true;
    updateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновляем...';
    
    // Симуляция задержки при обновлении
    setTimeout(() => {
        // Генерируем новые случайные значения
        const baseRate = 95 + Math.random() * 8; // от 95 до 103
        const changeAmount = (Math.random() * 2).toFixed(2); // от 0 до 2
        const changePercent = ((changeAmount / baseRate) * 100).toFixed(2);
        const isPositive = Math.random() > 0.3; // 70% шанс роста
        
        // Обновляем курс доллара
        if (usdRate) {
            usdRate.textContent = baseRate.toFixed(2);
        }
        
        // Обновляем изменение
        if (usdChange) {
            const changeText = isPositive ? 
                `+${changeAmount} (${changePercent}%)` : 
                `-${changeAmount} (${changePercent}%)`;
            
            usdChange.innerHTML = isPositive ?
                `<i class="fas fa-arrow-up"></i><span>${changeText}</span>` :
                `<i class="fas fa-arrow-down"></i><span>${changeText}</span>`;
            
            usdChange.className = isPositive ? 'rate-change positive' : 'rate-change negative';
        }
        
        // Обновляем другие валюты
        const otherRates = document.querySelectorAll('.other-rates .rate-number');
        const otherChanges = document.querySelectorAll('.other-rates .rate-change');
        
        otherRates.forEach((rate, index) => {
            const base = [106.32, 13.67, 124.89][index] || 100;
            const randomChange = (Math.random() - 0.5) * 2; // от -1 до 1
            const newRate = (base + randomChange).toFixed(2);
            rate.textContent = newRate;
            
            // Обновляем процент изменения
            if (otherChanges[index]) {
                const percent = ((randomChange / base) * 100).toFixed(2);
                const isPos = randomChange >= 0;
                otherChanges[index].textContent = isPos ? `+${Math.abs(percent)}%` : `-${Math.abs(percent)}%`;
                otherChanges[index].className = isPos ? 'rate-change positive' : 'rate-change negative';
            }
        });
        
        // Обновляем время
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        if (updateTime) {
            updateTime.textContent = `сегодня ${timeString}`;
        }
        
        // Шутки про курс доллара
        const jokes = [
            "Курс растет быстрее, чем ваши сбережения!",
            "Доллар решил, что гравитация - не для него!",
            "Рост курса: единственная гарантия в нашей жизни!",
            "Доллар летит в космос, а наш бюджет остается на земле!"
        ];
        
        const jokeElement = document.querySelector('.rate-joke p');
        if (jokeElement) {
            jokeElement.textContent = `"${jokes[Math.floor(Math.random() * jokes.length)]}"`;
        }
        
        // Возвращаем кнопку в исходное состояние
        updateBtn.classList.remove('updating');
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить курсы';
        
        // Показываем уведомление
        showNotification(isPositive ? 
            'Курс доллара вырос!' : 
            'Курс доллара немного упал!', 
            isPositive ? 'success' : 'warning'
        );
        
    }, 1500); // Имитация задержки сети
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease-out;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #27ae60;
    }
    
    .notification.warning {
        border-left: 4px solid #f39c12;
    }
    
    .notification.info {
        border-left: 4px solid #3498db;
    }
    
    .notification i {
        font-size: 1.5rem;
    }
    
    .notification.success i {
        color: #27ae60;
    }
    
    .notification.warning i {
        color: #f39c12;
    }
    
    .notification.info i {
        color: #3498db;
    }
    
    .notification span {
        flex: 1;
    }
    
    .close-notification {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .close-notification:hover {
        background: #ecf0f1;
    }
`;
document.head.appendChild(notificationStyles);

// Добавляем обновление курсов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем курсы каждые 30 секунд
    setInterval(updateExchangeRates, 30000);
    
    // Обработчик кнопки обновления
    const updateBtn = document.getElementById('update-rates');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateExchangeRates);
    }
});
});