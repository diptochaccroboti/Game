// Select elements for intro and game screen
const introScreen = document.getElementById('intro-screen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let gameRunning = false;
let score = 0;
const paddleWidth = 100;
const paddleHeight = 20;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 10;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Keyboard controls
let leftPressed = false;
let rightPressed = false;

// Event listeners for paddle movement (Keyboard)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
});

// Touch controls for mobile devices
let touchStartX = 0;

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
}, false);

canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const touchEndX = touch.clientX;

  if (touchEndX < touchStartX) {
    leftPressed = true;
    rightPressed = false;
  } else if (touchEndX > touchStartX) {
    rightPressed = true;
    leftPressed = false;
  }

  // Prevent default action to avoid scrolling
  e.preventDefault();
}, false);

canvas.addEventListener('touchend', () => {
  leftPressed = false;
  rightPressed = false;
}, false);

// Draw the paddle
function drawPaddle() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff0';
  ctx.fill();
  ctx.closePath();
}

// Update the ball position
function updateBallPosition() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off the left and right walls
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    ballSpeedX = -ballSpeedX;
  }

  // Bounce off the top wall
  if (ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball hits the paddle
  if (
    ballY + ballRadius >= canvas.height - paddleHeight - 10 &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY;
    score++;
    scoreElement.textContent = `Score: ${score}`;
  }

  // Ball falls below the paddle
  if (ballY - ballRadius > canvas.height) {
    gameRunning = false;
    restartButton.style.display = 'block';
    startButton.style.display = 'none';
    alert(`Game Over! Your final score is ${score}`);
  }
}

// Update paddle position
function updatePaddlePosition() {
  if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  }
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  drawPaddle();
  drawBall();
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  draw();
  updateBallPosition();
  updatePaddlePosition();

  requestAnimationFrame(gameLoop); // Repeat the game loop
}

// Start the game
function startGame() {
  introScreen.style.display = 'none'; // Hide intro screen
  gameContainer.style.display = 'block'; // Show game screen

  gameRunning = true;
  score = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 4;
  ballSpeedY = 4;
  paddleX = (canvas.width - paddleWidth) / 2;
  scoreElement.textContent = `Score: ${score}`;
  restartButton.style.display = 'none';
  gameLoop();
}

// Restart the game
restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
