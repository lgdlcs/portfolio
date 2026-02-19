const Snake = (() => {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const GRID = 20, COLS = 20, ROWS = 15;
    let snake, dir, food, score, interval, active = false;

    function init() {
        canvas.width = COLS * GRID;
        canvas.height = ROWS * GRID + 30;
        canvas.style.display = 'block';
        snake = [{ x: 10, y: 7 }];
        dir = { x: 1, y: 0 };
        score = 0;
        placeFood();
        active = true;
        document.addEventListener('keydown', onKey);
        interval = setInterval(tick, 120);
    }

    function placeFood() {
        do {
            food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        } while (snake.some(s => s.x === food.x && s.y === food.y));
    }

    function tick() {
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
            snake.some(s => s.x === head.x && s.y === head.y)) {
            return gameOver();
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            placeFood();
        } else {
            snake.pop();
        }
        draw();
    }

    function draw() {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // border
        ctx.strokeStyle = '#71717a';
        ctx.strokeRect(0, 0, COLS * GRID, ROWS * GRID);
        // food
        ctx.fillStyle = '#f87171';
        ctx.fillRect(food.x * GRID + 2, food.y * GRID + 2, GRID - 4, GRID - 4);
        // snake
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#4ade80' : '#6366f1';
            ctx.fillRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2);
        });
        // score
        ctx.fillStyle = '#e4e4e7';
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.fillText(`Score: ${score}  |  Arrow keys to move  |  q to quit`, 8, ROWS * GRID + 20);
    }

    function gameOver() {
        clearInterval(interval);
        ctx.fillStyle = 'rgba(10,10,10,0.8)';
        ctx.fillRect(0, 0, canvas.width, ROWS * GRID);
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 20px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2, (ROWS * GRID) / 2);
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.fillText('Press q to exit', canvas.width / 2, (ROWS * GRID) / 2 + 30);
        ctx.textAlign = 'start';
    }

    function onKey(e) {
        if (!active) return;
        const map = {
            ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        };
        if (map[e.key]) {
            const d = map[e.key];
            if (d.x !== -dir.x || d.y !== -dir.y) dir = d;
            e.preventDefault();
        }
        if (e.key === 'q' || e.key === 'Escape') quit();
    }

    function quit() {
        clearInterval(interval);
        active = false;
        canvas.style.display = 'none';
        document.removeEventListener('keydown', onKey);
        document.getElementById('input').focus();
    }

    return { init, isActive: () => active, quit };
})();
