// Корзина покупок

// Переменные для управления корзиной
let cart = [];
let discount = 0;
let discountCode = '';
let shippingCost = 0;

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderCart();
    updateCartCount();
    initCartEvents();
    loadRecommendedProducts();
});

// Загрузка корзины из localStorage
function loadCart() {
    const savedCart = localStorage.getItem('bookCart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('bookCart', JSON.stringify(cart));
}

// Обновление счетчика товаров в корзине (в шапке сайта)
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

// Инициализация обработчиков событий для корзины
function initCartEvents() {
    // Очистка корзины
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Применение промокода
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon-code');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', applyCoupon);
        couponInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
    
    // Оформление заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Изменение способа доставки
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', updateShipping);
    });
}

// Отрисовка содержимого корзины
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartElement = document.getElementById('empty-cart');
    
    if (!cartItemsContainer) return;
    
    // Если корзина пуста
    if (cart.length === 0) {
        if (emptyCartElement) {
            emptyCartElement.style.display = 'block';
        }
        cartItemsContainer.innerHTML = '';
        updateSummary();
        return;
    }
    
    // Скрываем сообщение о пустой корзине
    if (emptyCartElement) {
        emptyCartElement.style.display = 'none';
    }
    
    // Очищаем контейнер
    cartItemsContainer.innerHTML = '';
    
    // Добавляем товары
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Обновляем итоговую информацию
    updateSummary();
}

// Создание элемента товара в корзине
function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.dataset.id = item.id;
    
    const totalPrice = (item.price * item.quantity).toFixed(2);
    
    itemElement.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
            <div class="cart-item-header">
                <div>
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-author">${item.author}</p>
                </div>
                <div class="cart-item-price">
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-total">$${totalPrice}</div>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        </div>
    `;
    
    // Добавляем обработчики событий
    const minusBtn = itemElement.querySelector('.minus');
    const plusBtn = itemElement.querySelector('.plus');
    const quantityInput = itemElement.querySelector('.quantity-input');
    const removeBtn = itemElement.querySelector('.remove-item');
    
    minusBtn.addEventListener('click', function() {
        updateQuantity(item.id, item.quantity - 1);
    });
    
    plusBtn.addEventListener('click', function() {
        updateQuantity(item.id, item.quantity + 1);
    });
    
    quantityInput.addEventListener('change', function() {
        const newQuantity = parseInt(this.value);
        if (newQuantity >= 1 && newQuantity <= 99) {
            updateQuantity(item.id, newQuantity);
        } else {
            this.value = item.quantity;
        }
    });
    
    removeBtn.addEventListener('click', function() {
        removeFromCart(item.id);
    });
    
    return itemElement;
}

// Обновление количества товара
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    if (newQuantity > 99) {
        newQuantity = 99;
    }
    
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart();
        renderCart();
        updateCartCount();
    }
}

// Удаление товара из корзины
function removeFromCart(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    if (confirm(`Удалить "${item.title}" из корзины?`)) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
        updateCartCount();
        
        showNotification(`"${item.title}" удалена из корзины`);
    }
}

// Очистка корзины
function clearCart() {
    if (cart.length === 0) {
        showNotification('Корзина уже пуста');
        return;
    }
    
    if (confirm('Очистить всю корзину?')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        
        showNotification('Корзина очищена');
    }
}

// Обновление итоговой информации
function updateSummary() {
    // Подсчет суммы товаров
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Количество товаров
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Скидка
    const discountAmount = discount > 0 ? subtotal * discount : 0;
    
    // Итоговая сумма
    const total = subtotal + shippingCost - discountAmount;
    
    // Обновляем элементы на странице
    const itemsCountElement = document.getElementById('items-count');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (itemsCountElement) itemsCountElement.textContent = itemsCount;
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shippingCost === 0 ? 'Бесплатно' : `$${shippingCost.toFixed(2)}`;
    if (discountElement) discountElement.textContent = discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : '$0.00';
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Обновление стоимости доставки
function updateShipping() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    
    if (!selectedShipping) return;
    
    switch(selectedShipping.value) {
        case 'pickup':
            shippingCost = 0;
            break;
        case 'courier':
            shippingCost = 5.99;
            break;
        case 'post':
            shippingCost = 3.99;
            break;
        default:
            shippingCost = 0;
    }
    
    updateSummary();
}

// Применение промокода
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    if (!couponInput) return;
    
    const code = couponInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Введите промокод');
        return;
    }
    
    // Проверяем промокоды
    const validCoupons = {
        'WELCOME10': 0.10, // 10% скидка
        'BOOKLOVER': 0.15, // 15% скидка
        'FREESHIP': 'free', // Бесплатная доставка
        'SAVE5': 0.05 // 5% скидка
    };
    
    if (validCoupons[code]) {
        discountCode = code;
        
        if (validCoupons[code] === 'free') {
            // Бесплатная доставка
            document.getElementById('pickup').checked = true;
            updateShipping();
            showNotification('Промокод применен: бесплатная доставка!');
        } else {
            // Процентная скидка
            discount = validCoupons[code];
            showNotification(`Промокод применен: скидка ${discount * 100}%!`);
        }
        
        updateSummary();
    } else {
        showNotification('Неверный промокод');
        discount = 0;
        discountCode = '';
        updateSummary();
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину перед оформлением заказа');
        return;
    }
    
    // Собираем данные для заказа
    const order = {
        items: cart,
        subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        shipping: shippingCost,
        discount: discount,
        discountCode: discountCode,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingCost - (cart.reduce((total, item) => total + (item.price * item.quantity), 0) * discount),
        date: new Date().toISOString(),
        orderId: 'ORD-' + Date.now()
    };
    
    // В реальном приложении здесь будет отправка данных на сервер
    // Для демонстрации сохраняем заказ в localStorage
    const orders = JSON.parse(localStorage.getItem('bookOrders')) || [];
    orders.push(order);
    localStorage.setItem('bookOrders', JSON.stringify(orders));
    
    // Очищаем корзину
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    
    // Сбрасываем скидку и доставку
    discount = 0;
    discountCode = '';
    shippingCost = 0;
    
    // Сбрасываем форму доставки
    document.getElementById('pickup').checked = true;
    updateShipping();
    
    // Показываем сообщение об успешном заказе
    alert(`Заказ оформлен успешно!\n\nНомер заказа: ${order.orderId}\nИтоговая сумма: $${order.total.toFixed(2)}\n\nСпасибо за покупку!`);
}

// Загрузка рекомендуемых товаров
function loadRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommended-products');
    if (!recommendedContainer) return;
    
    // Получаем книги, которых нет в корзине
    const cartIds = cart.map(item => item.id);
    const recommendedBooks = books
        .filter(book => !cartIds.includes(book.id))
        .slice(0, 4); // Берем 4 книги
    
    if (recommendedBooks.length === 0) {
        recommendedContainer.style.display = 'none';
        return;
    }
    
    // Очищаем контейнер
    recommendedContainer.innerHTML = '';
    
    // Добавляем рекомендуемые товары
    recommendedBooks.forEach(book => {
        const bookElement = createRecommendedProductElement(book);
        recommendedContainer.appendChild(bookElement);
    });
}

// Создание элемента рекомендуемого товара
function createRecommendedProductElement(book) {
    const element = document.createElement('div');
    element.className = 'recommended-item';
    
    element.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h4>${book.title}</h4>
        <p class="recommended-author">${book.author}</p>
        <div class="recommended-price">$${book.price.toFixed(2)}</div>
        <button class="recommended-btn" data-id="${book.id}">
            <i class="fas fa-cart-plus"></i> В корзину
        </button>
    `;
    
    // Добавляем обработчик события
    const addButton = element.querySelector('.recommended-btn');
    addButton.addEventListener('click', function() {
        addToCart(book.id);
    });
    
    return element;
}

// Добавление в корзину (для рекомендуемых товаров)
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Проверяем, есть ли книга уже в корзине
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        // Увеличиваем количество
        existingItem.quantity += 1;
    } else {
        // Добавляем новую книгу
        cart.push({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            image: book.image,
            quantity: 1
        });
    }
    
    // Сохраняем корзину
    saveCart();
    
    // Обновляем отображение
    renderCart();
    updateCartCount();
    loadRecommendedProducts();
    
    // Показываем уведомление
    showNotification(`"${book.title}" добавлена в корзину!`);
}

// Показать уведомление
function showNotification(message) {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        
        // Удаляем элемент после анимации
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}