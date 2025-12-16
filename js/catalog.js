// Каталог товаров

// Массив книг для каталога
const books = [
    {
        id: 1,
        title: "Мастер и Маргарита",
        author: "Михаил Булгаков",
        category: "fiction",
        price: 19.99,
        oldPrice: 24.99,
        rating: 4.8,
        image: "assets/images/product1.jpg",
        description: "Классика русской литературы, философский роман о любви, добре и зле.",
        authorId: "dostoevsky"
    },
    {
        id: 2,
        title: "1984",
        author: "Джордж Оруэлл",
        category: "fiction",
        price: 16.50,
        oldPrice: null,
        rating: 4.7,
        image: "assets/images/product2.jpg",
        description: "Антиутопия о тоталитарном обществе, где правит Большой Брат.",
        authorId: "orwell"
    },
    {
        id: 3,
        title: "Убить пересмешника",
        author: "Харпер Ли",
        category: "fiction",
        price: 18.75,
        oldPrice: 22.50,
        rating: 4.9,
        image: "assets/images/product3.jpg",
        description: "Трогательная история о расовой несправедливости и моральной стойкости.",
        authorId: "lee"
    },
    {
        id: 4,
        title: "Великий Гэтсби",
        author: "Фрэнсис Скотт Фицджеральд",
        category: "fiction",
        price: 15.25,
        oldPrice: null,
        rating: 4.6,
        image: "assets/images/product4.jpg",
        description: "Роман о американской мечте, любви и трагедии в эпоху джаза.",
        authorId: "fitzgerald"
    },
    {
        id: 5,
        title: "Властелин Колец: Братство Кольца",
        author: "Дж.Р.Р. Толкин",
        category: "fantasy",
        price: 22.99,
        oldPrice: 28.50,
        rating: 4.9,
        image: "assets/images/placeholder.jpg",
        description: "Первая часть эпической трилогии о Средиземье и борьбе с темными силами.",
        authorId: "tolkien"
    },
    {
        id: 6,
        title: "Гарри Поттер и философский камень",
        author: "Дж.К. Роулинг",
        category: "fantasy",
        price: 21.50,
        oldPrice: null,
        rating: 4.8,
        image: "assets/images/placeholder.jpg",
        description: "Первая книга о юном волшебнике Гарри Поттере и его приключениях в Хогвартсе.",
        authorId: "rowling"
    },
    {
        id: 7,
        title: "Игра престолов",
        author: "Джордж Мартин",
        category: "fantasy",
        price: 24.99,
        oldPrice: 29.99,
        rating: 4.7,
        image: "assets/images/placeholder.jpg",
        description: "Эпическая сага о борьбе за железный трон в вымышленном мире Вестероса.",
        authorId: "martin"
    },
    {
        id: 8,
        title: "Оно",
        author: "Стивен Кинг",
        category: "fiction",
        price: 20.75,
        oldPrice: 25.00,
        rating: 4.6,
        image: "assets/images/placeholder.jpg",
        description: "Триллер о группе детей, столкнувшихся с древним злом в маленьком городке.",
        authorId: "king"
    },
    {
        id: 9,
        title: "Преступление и наказание",
        author: "Ф.М. Достоевский",
        category: "fiction",
        price: 17.25,
        oldPrice: null,
        rating: 4.8,
        image: "assets/images/placeholder.jpg",
        description: "Психологический роман о студенте, совершившем убийство и его моральных терзаниях.",
        authorId: "dostoevsky"
    },
    {
        id: 10,
        title: "Шерлок Холмс: Сборник рассказов",
        author: "Артур Конан Дойл",
        category: "detective",
        price: 18.50,
        oldPrice: 22.00,
        rating: 4.7,
        image: "assets/images/placeholder.jpg",
        description: "Сборник детективных рассказов о знаменитом сыщике Шерлоке Холмсе.",
        authorId: "doyle"
    },
    {
        id: 11,
        title: "Краткая история времени",
        author: "Стивен Хокинг",
        category: "science",
        price: 23.99,
        oldPrice: null,
        rating: 4.5,
        image: "assets/images/placeholder.jpg",
        description: "Популярное изложение космологии и фундаментальных вопросов мироздания.",
        authorId: "hawking"
    },
    {
        id: 12,
        title: "Стив Джобс",
        author: "Уолтер Айзексон",
        category: "biography",
        price: 25.50,
        oldPrice: 30.00,
        rating: 4.6,
        image: "assets/images/placeholder.jpg",
        description: "Биография сооснователя Apple, основанная на интервью с ним и его близкими.",
        authorId: "isaacson"
    }
];

// Переменные для управления каталогом
let filteredBooks = [...books];
let currentPage = 1;
const booksPerPage = 6;
let currentView = 'grid'; // 'grid' или 'list'

// Инициализация каталога при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCatalog();
    initFilters();
    initViewToggle();
    renderBooks();
    updateBooksCount();
    renderPagination();
});

// Инициализация каталога
function initCatalog() {
    const catalogContainer = document.getElementById('catalog-container');
    if (!catalogContainer) return;
    
    // Показываем сообщение о загрузке
    catalogContainer.innerHTML = '<div class="loading">Загрузка каталога...</div>';
}

// Инициализация фильтров
function initFilters() {
    // Обработчик кнопки сброса фильтров
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            resetFilters();
            filterBooks();
        });
    }
    
    // Обработчики фильтров категорий
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', filterBooks);
    });
    
    // Обработчики фильтров авторов
    const authorFilters = document.querySelectorAll('input[name="author"]');
    authorFilters.forEach(filter => {
        filter.addEventListener('change', filterBooks);
    });
    
    // Обработчики ценового диапазона
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minPriceSlider = document.getElementById('price-slider-min');
    const maxPriceSlider = document.getElementById('price-slider-max');
    
    if (minPriceInput && maxPriceInput && minPriceSlider && maxPriceSlider) {
        // Устанавливаем максимальные значения
        minPriceSlider.max = 100;
        maxPriceSlider.max = 100;
        
        // Синхронизация ползунков и полей ввода
        minPriceInput.addEventListener('input', function() {
            minPriceSlider.value = this.value;
            filterBooks();
        });
        
        maxPriceInput.addEventListener('input', function() {
            maxPriceSlider.value = this.value;
            filterBooks();
        });
        
        minPriceSlider.addEventListener('input', function() {
            minPriceInput.value = this.value;
            filterBooks();
        });
        
        maxPriceSlider.addEventListener('input', function() {
            maxPriceInput.value = this.value;
            filterBooks();
        });
    }
    
    // Обработчик сортировки
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortBooks();
        });
    }
    
    // Обработчик поиска
    const searchInput = document.getElementById('catalog-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterBooks();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterBooks();
            }
        });
    }
}

// Инициализация переключения вида
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Меняем вид
            currentView = this.dataset.view;
            renderBooks();
        });
    });
}

// Сброс фильтров
function resetFilters() {
    // Сбрасываем все чекбоксы категорий
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Сбрасываем все чекбоксы авторов
    document.querySelectorAll('input[name="author"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Сбрасываем ценовой диапазон
    document.getElementById('min-price').value = 0;
    document.getElementById('max-price').value = 100;
    document.getElementById('price-slider-min').value = 0;
    document.getElementById('price-slider-max').value = 100;
    
    // Сбрасываем сортировку
    document.getElementById('sort-by').value = 'default';
    
    // Сбрасываем поиск
    document.getElementById('catalog-search').value = '';
}

// Фильтрация книг
function filterBooks() {
    // Получаем выбранные категории
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Получаем выбранных авторов
    const selectedAuthors = Array.from(document.querySelectorAll('input[name="author"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Получаем ценовой диапазон
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || 100;
    
    // Получаем поисковый запрос
    const searchQuery = document.getElementById('catalog-search').value.toLowerCase();
    
    // Фильтруем книги
    filteredBooks = books.filter(book => {
        // Фильтр по категории
        if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
            return false;
        }
        
        // Фильтр по автору (если авторы выбраны)
        if (selectedAuthors.length > 0 && (!book.authorId || !selectedAuthors.includes(book.authorId))) {
            return false;
        }
        
        // Фильтр по цене
        if (book.price < minPrice || book.price > maxPrice) {
            return false;
        }
        
        // Фильтр по поисковому запросу
        if (searchQuery) {
            const titleMatch = book.title.toLowerCase().includes(searchQuery);
            const authorMatch = book.author.toLowerCase().includes(searchQuery);
            if (!titleMatch && !authorMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    // Сортируем книги
    sortBooks();
    
    // Сбрасываем текущую страницу
    currentPage = 1;
    
    // Обновляем отображение
    updateBooksCount();
    renderBooks();
    renderPagination();
}

// Сортировка книг
function sortBooks() {
    const sortBy = document.getElementById('sort-by').value;
    
    switch(sortBy) {
        case 'price-asc':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'popular':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // По умолчанию - порядок как в исходном массиве
            filteredBooks = filteredBooks.sort((a, b) => a.id - b.id);
    }
    
    renderBooks();
}

// Обновление счетчика книг
function updateBooksCount() {
    const booksCountElement = document.getElementById('books-count');
    if (booksCountElement) {
        booksCountElement.textContent = filteredBooks.length;
    }
}

// Отрисовка книг
function renderBooks() {
    const catalogContainer = document.getElementById('catalog-container');
    if (!catalogContainer) return;
    
    // Вычисляем книги для текущей страницы
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    // Если книг нет
    if (booksToShow.length === 0) {
        catalogContainer.innerHTML = `
            <div class="no-books">
                <i class="fas fa-book-open"></i>
                <h3>Книги не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    // Очищаем контейнер
    catalogContainer.innerHTML = '';
    
    // Устанавливаем класс для вида отображения
    catalogContainer.className = currentView === 'list' ? 'catalog-grid list-view' : 'catalog-grid';
    
    // Добавляем книги
    booksToShow.forEach(book => {
        const bookElement = createBookElement(book);
        catalogContainer.appendChild(bookElement);
    });
    
    // Добавляем стили для сообщения "нет книг"
    if (!document.getElementById('catalog-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'catalog-styles';
        styleElement.textContent = `
            .loading, .no-books {
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .no-books i {
                font-size: 3rem;
                color: #ddd;
                margin-bottom: 20px;
            }
            
            .no-books h3 {
                font-size: 1.5rem;
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .no-books p {
                color: #666;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Создание элемента книги
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'catalog-item';
    bookElement.dataset.id = book.id;
    
    // Форматируем цену
    const priceHTML = book.oldPrice 
        ? `<div class="price">$${book.price.toFixed(2)}</div><div class="old-price">$${book.oldPrice.toFixed(2)}</div>`
        : `<div class="price">$${book.price.toFixed(2)}</div>`;
    
    // Создаем звездочки рейтинга
    const ratingStars = createRatingStars(book.rating);
    
    bookElement.innerHTML = `
        <div class="catalog-item-image">
            <img src="${book.image}" alt="${book.title}">
        </div>
        <div class="catalog-item-info">
            <h3 class="catalog-item-title">${book.title}</h3>
            <p class="catalog-item-author">${book.author}</p>
            <span class="catalog-item-category">${getCategoryName(book.category)}</span>
            <div class="catalog-item-price">
                ${priceHTML}
                <div class="catalog-item-rating">
                    ${ratingStars}
                    <span>${book.rating}</span>
                </div>
            </div>
            <div class="catalog-item-actions">
                <button class="catalog-item-btn add-to-cart" data-id="${book.id}">
                    <i class="fas fa-shopping-cart"></i> В корзину
                </button>
                <button class="catalog-item-btn add-to-wishlist" data-id="${book.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Добавляем обработчики событий
    const addToCartBtn = bookElement.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(book.id);
    });
    
    const addToWishlistBtn = bookElement.querySelector('.add-to-wishlist');
    addToWishlistBtn.addEventListener('click', function() {
        addToWishlist(book.id);
    });
    
    return bookElement;
}

// Создание звездочек рейтинга
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Полные звезды
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Половина звезды
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Пустые звезды
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'fiction': 'Художественная литература',
        'fantasy': 'Фэнтези',
        'detective': 'Детективы',
        'science': 'Научная литература',
        'biography': 'Биографии'
    };
    
    return categories[category] || category;
}

// Добавление в корзину
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Получаем текущую корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
    
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
    localStorage.setItem('bookCart', JSON.stringify(cart));
    
    // Обновляем счетчик в шапке
    updateCartCount();
    
    // Показываем уведомление
    showNotification(`"${book.title}" добавлена в корзину!`);
    
    // Анимируем кнопку
    const addButton = document.querySelector(`.add-to-cart[data-id="${bookId}"]`);
    if (addButton) {
        const originalText = addButton.innerHTML;
        addButton.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        addButton.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            addButton.innerHTML = originalText;
            addButton.style.backgroundColor = '';
        }, 1500);
    }
}

// Добавление в избранное
function addToWishlist(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Получаем текущее избранное из localStorage
    let wishlist = JSON.parse(localStorage.getItem('bookWishlist')) || [];
    
    // Проверяем, есть ли книга уже в избранном
    const existingItem = wishlist.find(item => item.id === bookId);
    
    if (!existingItem) {
        // Добавляем новую книгу
        wishlist.push({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            image: book.image
        });
        
        // Сохраняем избранное
        localStorage.setItem('bookWishlist', JSON.stringify(wishlist));
        
        // Показываем уведомление
        showNotification(`"${book.title}" добавлена в избранное!`);
        
        // Анимируем кнопку
        const wishlistButton = document.querySelector(`.add-to-wishlist[data-id="${bookId}"]`);
        if (wishlistButton) {
            const originalHTML = wishlistButton.innerHTML;
            wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistButton.style.color = '#e74c3c';
            
            setTimeout(() => {
                wishlistButton.innerHTML = originalHTML;
                wishlistButton.style.color = '';
            }, 1500);
        }
    } else {
        showNotification(`"${book.title}" уже в избранном!`);
    }
}

// Отрисовка пагинации
function renderPagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;
    
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (totalPages <= 1) {
        paginationElement.style.display = 'none';
        return;
    }
    
    paginationElement.style.display = 'flex';
    
    // Кнопки "Назад" и "Вперед"
    const prevBtn = paginationElement.querySelector('.prev');
    const nextBtn = paginationElement.querySelector('.next');
    const numbersContainer = paginationElement.querySelector('.pagination-numbers');
    
    // Обновляем состояние кнопок
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Добавляем обработчики событий
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
            updatePaginationUI();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks();
            updatePaginationUI();
        }
    };
    
    // Генерируем номера страниц
    numbersContainer.innerHTML = '';
    
    // Всегда показываем первую страницу
    addPageNumber(1, numbersContainer);
    
    // Показываем многоточие, если нужно
    if (currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        numbersContainer.appendChild(ellipsis);
    }
    
    // Показываем страницы вокруг текущей
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
            addPageNumber(i, numbersContainer);
        }
    }
    
    // Показываем многоточие, если нужно
    if (currentPage < totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        numbersContainer.appendChild(ellipsis);
    }
    
    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
        addPageNumber(totalPages, numbersContainer);
    }
    
    // Добавляем стили для многоточия
    if (!document.getElementById('pagination-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'pagination-styles';
        styleElement.textContent = `
            .pagination-ellipsis {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                color: #666;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Обновляем активную страницу
    updatePaginationUI();
}

// Добавление номера страницы
function addPageNumber(pageNumber, container) {
    const pageElement = document.createElement('button');
    pageElement.className = 'pagination-number';
    pageElement.textContent = pageNumber;
    
    if (pageNumber === currentPage) {
        pageElement.classList.add('active');
    }
    
    pageElement.addEventListener('click', () => {
        currentPage = pageNumber;
        renderBooks();
        updatePaginationUI();
    });
    
    container.appendChild(pageElement);
}

// Обновление UI пагинации
function updatePaginationUI() {
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    paginationNumbers.forEach(number => {
        number.classList.remove('active');
        if (parseInt(number.textContent) === currentPage) {
            number.classList.add('active');
        }
    });
    
    // Обновляем состояние кнопок "Назад" и "Вперед"
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
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