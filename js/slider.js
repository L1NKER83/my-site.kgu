// Слайдер книг

class Slider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slides = this.container ? this.container.querySelectorAll('.slide') : [];
        this.indicators = this.container ? this.container.querySelectorAll('.indicator') : [];
        this.prevBtn = this.container ? this.container.querySelector('.slider-btn.prev') : null;
        this.nextBtn = this.container ? this.container.querySelector('.slider-btn.next') : null;
        
        this.currentSlide = 0;
        this.slideInterval = null;
        this.intervalTime = 4000; // 4 секунды
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Показываем первый слайд
        this.showSlide(this.currentSlide);
        
        // Назначаем обработчики событий для кнопок
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Назначаем обработчики событий для индикаторов
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Запускаем автопрокрутку
        this.startAutoSlide();
        
        // Останавливаем автопрокрутку при наведении мыши
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Добавляем поддержку свайпов на мобильных устройствах
        this.addTouchEvents();
    }
    
    showSlide(index) {
        // Скрываем все слайды
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убираем активный класс со всех индикаторов
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Показываем текущий слайд
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        this.currentSlide = index;
    }
    
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    addTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, {passive: true});
    }
    
    handleSwipe(startX, endX) {
        const minSwipeDistance = 50;
        
        if (startX - endX > minSwipeDistance) {
            // Свайп влево - следующий слайд
            this.nextSlide();
        }
        
        if (endX - startX > minSwipeDistance) {
            // Свайп вправо - предыдущий слайд
            this.prevSlide();
        }
    }
}

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const slider = new Slider('book-slider');
});