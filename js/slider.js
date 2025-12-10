// Объект слайдера
class Slider {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.slides');
        this.slideItems = container.querySelectorAll('.slide');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.dots = container.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.totalSlides = this.slideItems.length;
        this.interval = null;
        this.autoplayDelay = 4000; // 4 секунды
        this.isPaused = false;

        this.init();
    }

    init() {
        // Показываем первый слайд
        this.showSlide(this.currentIndex);

        // Устанавливаем обработчики событий
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Обработчики для точек
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Автопрокрутка
        this.startAutoplay();

        // Остановка автопрокрутки при наведении
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
            this.stopAutoplay();
        });

        this.container.addEventListener('mouseleave', () => {
            this.isPaused = false;
            this.startAutoplay();
        });

        // Остановка автопрокрутки при фокусе на кнопках
        this.prevBtn.addEventListener('focus', () => this.stopAutoplay());
        this.nextBtn.addEventListener('focus', () => this.stopAutoplay());
        this.prevBtn.addEventListener('blur', () => {
            if (!this.isPaused) this.startAutoplay();
        });
        this.nextBtn.addEventListener('blur', () => {
            if (!this.isPaused) this.startAutoplay();
        });

        // Клавиатурное управление
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    showSlide(index) {
        // Скрываем все слайды
        this.slideItems.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        // Показываем текущий слайд
        this.slideItems[index].classList.add('active');
        setTimeout(() => {
            this.slideItems[index].style.opacity = '1';
        }, 50);

        // Обновляем точки
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[index].classList.add('active');

        // Обновляем позицию слайдов
        this.slides.style.transform = `translateX(-${index * 100}%)`;
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(this.currentIndex);
        this.restartAutoplay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(this.currentIndex);
        this.restartAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
        this.restartAutoplay();
    }

    startAutoplay() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    restartAutoplay() {
        this.stopAutoplay();
        if (!this.isPaused) {
            this.startAutoplay();
        }
    }
}

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider');
    if (sliderContainer) {
        new Slider(sliderContainer);
    }
});