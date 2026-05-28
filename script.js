// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 7;

// Player paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: 5,
    dy: 5,
    speed: 5
};

// Score
let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
let mouseY = canvas.height / 2;
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Draw functions
function drawRect(x, y, width, height, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#666');
    }
}

function drawGame() {
    // Clear canvas with semi-transparent background
    ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, '#00ff00');
    drawRect(computer.x, computer.y, computer.width, computer.height, '#ff0000');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#ffff00');
}

// Update player paddle position
function updatePlayer() {
    // Use mouse position
    player.y = mouseY - paddleHeight / 2;

    // Allow arrow keys as alternative
    if (keys['ArrowUp']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown']) {
        player.y += player.speed;
    }

    // Keep paddle in bounds
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + paddleHeight > canvas.height) {
        player.y = canvas.height - paddleHeight;
    }
}

// Update computer paddle (AI)
function updateComputer() {
    const computerCenter = computer.y + paddleHeight / 2;
    const ballCenter = ball.y;

    // Simple AI: track the ball
    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }

    // Keep paddle in bounds
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + paddleHeight > canvas.height) {
        computer.y = canvas.height - paddleHeight;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Ball collision with paddles
    // Player paddle collision
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy = (deltaY / (player.height / 2)) * ball.speed;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = (deltaY / (computer.height / 2)) * ball.speed;
    }

    // Score points when ball goes out of bounds
    if (ball.x - ball.radius < 0) {
        computerScore++;
        updateScore();
        resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        updateScore();
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Update score display
function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
