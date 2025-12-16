// Общая логика сайта

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация навигационного меню
    initNavigation();
    
    // Инициализация курса доллара (симуляция)
    initCurrencyRates();
    
    // Инициализация формы контактов (если есть на странице)
    initContactForm();
    
    // Инициализация обработчиков событий для товаров
    initProductButtons();
});

// Навигационное меню
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            
            // Меняем иконку гамбургера на крестик и обратно
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрываем меню при клике на ссылку (для мобильных устройств)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    navMenu.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Закрываем меню при клике вне его области
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Курс доллара (симуляция)
function initCurrencyRates() {
    const usdBuyElement = document.getElementById('usd-buy');
    const usdSellElement = document.getElementById('usd-sell');
    
    if (usdBuyElement && usdSellElement) {
        // Генерируем случайные значения курса (в реальности здесь будет API)
        const baseBuy = 90.50;
        const baseSell = 91.20;
        
        // Добавляем небольшое случайное изменение
        const randomBuyChange = (Math.random() - 0.5) * 0.5;
        const randomSellChange = (Math.random() - 0.5) * 0.5;
        
        const buyRate = (baseBuy + randomBuyChange).toFixed(2);
        const sellRate = (baseSell + randomSellChange).toFixed(2);
        
        usdBuyElement.textContent = `${buyRate} ₽`;
        usdSellElement.textContent = `${sellRate} ₽`;
        
        // Обновляем курс каждые 10 минут (600000 мс)
        // В реальном приложении здесь будет запрос к API
        setInterval(function() {
            const newRandomBuyChange = (Math.random() - 0.5) * 0.5;
            const newRandomSellChange = (Math.random() - 0.5) * 0.5;
            
            const newBuyRate = (baseBuy + newRandomBuyChange).toFixed(2);
            const newSellRate = (baseSell + newRandomSellChange).toFixed(2);
            
            // Плавное обновление значений
            animateValueChange(usdBuyElement, buyRate, newBuyRate);
            animateValueChange(usdSellElement, sellRate, newSellRate);
        }, 600000); // 10 минут
    }
}

// Анимация изменения значения курса
function animateValueChange(element, oldValue, newValue) {
    let current = parseFloat(oldValue);
    const target = parseFloat(newValue);
    const increment = (target - current) / 20; // 20 шагов анимации
    
    const interval = setInterval(() => {
        current += increment;
        
        // Проверяем, достигли ли целевого значения
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            current = target;
            clearInterval(interval);
        }
        
        element.textContent = `${current.toFixed(2)} ₽`;
    }, 50); // 50ms между шагами
}

// Форма контактов
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // В реальном приложении здесь будет отправка на сервер
            // Для демонстрации просто показываем сообщение
            alert(`Спасибо, ${data.name}! Ваше сообщение отправлено. Мы ответим вам на email ${data.email} в течение 24 часов.`);
            
            // Очищаем форму
            this.reset();
        });
    }
}

// Кнопки товаров
function initProductButtons() {
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Добавляем анимацию
            this.textContent = 'Добавлено!';
            this.style.backgroundColor = '#27ae60';
            
            // В реальном приложении здесь будет добавление в корзину
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.style.backgroundColor = '';
                
                // Показываем уведомление
                showNotification(`${productTitle} добавлен в корзину за ${productPrice}`);
            }, 1500);
        });
    });
}

// Уведомление
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        
        // Удаляем элемент после анимации
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
// Обновление счетчика корзины на всех страницах
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

// Обновление навигации для всех страниц
function updateNavigation() {
    // Добавляем счетчик товаров в корзине
    updateCartCount();
}

// Вызов функции при загрузке каждой страницы
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Обновляем навигацию (включая счетчик корзины)
    updateNavigation();
});