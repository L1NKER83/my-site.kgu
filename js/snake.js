// Мини-игра Змейка - исправленная версия
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snake-game');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-game');
    const pauseBtn = document.getElementById('pause-game');
    const resetBtn = document.getElementById('reset-game');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [
        {x: 10, y: 10}
    ];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gameLoop;
    let gameSpeed = 150;

    // Инициализация рекорда
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;

    function randomTile() {
        return Math.floor(Math.random() * tileCount);
    }

    function generateFood() {
        // Генерируем еду так, чтобы она не попала на змейку
        let newFood;
        let onSnake;
        
        do {
            newFood = {
                x: randomTile(),
                y: randomTile()
            };
            onSnake = false;
            
            for (let segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);
        
        food = newFood;
    }

    function drawGame() {
        // Очистка canvas
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Рисуем сетку
        ctx.strokeStyle = '#bdc3c7';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        // Рисуем еду (акции)
        ctx.fillStyle = '#27ae60'; // Зеленый цвет для акций
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize/2,
            food.y * gridSize + gridSize/2,
            gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Знак доллара на еде
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 
            food.x * gridSize + gridSize/2, 
            food.y * gridSize + gridSize/2
        );

        // Рисуем змейку (инвестора)
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Голова змейки (инвестор)
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
                
                // Глаза
                ctx.fillStyle = 'white';
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 4, 4);
                ctx.fillRect(segment.x * gridSize + 11, segment.y * gridSize + 5, 4, 4);
            } else {
                // Тело змейки (деньги)
                ctx.fillStyle = '#3498db';
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
                
                // Знак доллара на каждом сегменте
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 
                    segment.x * gridSize + gridSize/2, 
                    segment.y * gridSize + gridSize/2
                );
            }
        });
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        // Проверка на столкновение со стенами
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Проверка на столкновение с собой
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // Проверка, съела ли змейка еду
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (scoreDisplay) scoreDisplay.textContent = score;
            
            // Обновляем рекорд
            if (score > highScore) {
                highScore = score;
                if (highScoreDisplay) highScoreDisplay.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Увеличиваем скорость каждые 50 очков
            if (score % 50 === 0 && gameSpeed > 70) {
                gameSpeed -= 20;
                if (gameLoop) {
                    clearInterval(gameLoop);
                    gameLoop = setInterval(update, gameSpeed);
                }
            }
            
            generateFood();
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        gameRunning = false;
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = null;
        }
        
        // Анимация проигрыша
        ctx.fillStyle = 'rgba(231, 76, 60, 0.9)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('БАНКРОТ!', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText(`Капитал: $${score}`, canvas.width/2, canvas.height/2 + 10);
        
        // Шутка при проигрыше
        const jokes = [
            "Ваш брокер ушел в отпуск!",
            "Акции упали вместе с вашим настроением!",
            "Медвежий рынок победил!",
            "Хеджирование не помогло!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        ctx.font = '14px Arial';
        ctx.fillText(joke, canvas.width/2, canvas.height/2 + 40);
        
        if (startBtn) {
            startBtn.textContent = 'Начать заново';
            startBtn.disabled = false;
        }
    }

    function update() {
        if (gameRunning) {
            moveSnake();
            drawGame();
        }
    }

    function startGame() {
        if (!gameRunning) {
            if (dx === 0 && dy === 0) {
                // Если игра еще не начата, задаем начальное направление
                dx = 1;
                dy = 0;
            }
            
            gameRunning = true;
            gameSpeed = 150;
            
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
            
            if (startBtn) {
                startBtn.textContent = 'Игра идет...';
                startBtn.disabled = true;
            }
        }
    }

    function pauseGame() {
        if (gameRunning) {
            gameRunning = false;
            if (gameLoop) {
                clearInterval(gameLoop);
                gameLoop = null;
            }
            
            if (startBtn) {
                startBtn.textContent = 'Продолжить';
                startBtn.disabled = false;
            }
            
            // Показываем текст паузы
            ctx.fillStyle = 'rgba(52, 152, 219, 0.9)';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('БИРЖА НА ПЕРЕРЫВЕ', canvas.width/2, canvas.height/2);
            ctx.font = '16px Arial';
            ctx.fillText('Кофе-брейк трейдера', canvas.width/2, canvas.height/2 + 30);
        } else if (startBtn && !startBtn.disabled) {
            startGame();
        }
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        if (scoreDisplay) scoreDisplay.textContent = score;
        gameSpeed = 150;
        
        if (gameRunning) {
            gameRunning = false;
            if (gameLoop) {
                clearInterval(gameLoop);
                gameLoop = null;
            }
        }
        
        if (startBtn) {
            startBtn.textContent = 'Начать игру';
            startBtn.disabled = false;
        }
        
        generateFood();
        drawGame();
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;

        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (e.key === 'ArrowUp' && !goingDown) {
            dx = 0;
            dy = -1;
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && !goingUp) {
            dx = 0;
            dy = 1;
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' && !goingRight) {
            dx = -1;
            dy = 0;
            e.preventDefault();
        } else if (e.key === 'ArrowRight' && !goingLeft) {
            dx = 1;
            dy = 0;
            e.preventDefault();
        }
    });

    // Назначение обработчиков кнопок
    if (startBtn) startBtn.addEventListener('click', startGame);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);

    // Инициализация игры
    generateFood();
    drawGame();
    
    // Добавляем управление для сенсорных устройств
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 30;
    
    if (canvas) {
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, {passive: false});
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, {passive: false});
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!gameRunning) return;
            
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            
            const dxTouch = touchEndX - touchStartX;
            const dyTouch = touchEndY - touchStartY;
            
            // Проверяем, был ли это свайп
            if (Math.abs(dxTouch) > Math.abs(dyTouch) && Math.abs(dxTouch) > minSwipeDistance) {
                // Горизонтальный свайп
                if (dxTouch > 0 && dx !== -1) {
                    dx = 1;
                    dy = 0;
                } else if (dxTouch < 0 && dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
            } else if (Math.abs(dyTouch) > minSwipeDistance) {
                // Вертикальный свайп
                if (dyTouch > 0 && dy !== -1) {
                    dx = 0;
                    dy = 1;
                } else if (dyTouch < 0 && dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
            }
        }, {passive: false});
    }
});