const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const scoreElement = document.querySelector(".score");
const levelElement = document.querySelector(".level");
const highScoreElement = document.querySelector(".high-score");
const pausebtn = document.getElementById("pausebutton");
const restartbtn = document.getElementById("restartbutton");

const box = 20;
let snake, food, direction, game;
let score = 0;
let level = 1;
let paused = false;
let walls = [];
let speed = 150;

let highScore = parseInt(localStorage.getItem("high-score")) || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
let current_level = parseInt(localStorage.getItem("current-level")) || 1;

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function getWallsByLevels(level) {
  let wallsArray = [];
  // Example walls for level 2
//   if (level === 2) {
//     for (let i = 5; i < 15; i++) {
//       wallsArray.push({ x: i * box, y: 10 * box });
//     }
//   }
//   // Example walls for level 3
//   else if (level === 3) {
//     for (let i = 8; i < 20; i++) {
//       wallsArray.push({ x: i * box, y: 5 * box });
//       wallsArray.push({ x: i * box, y: 15 * box });
//     }
//   }
  return wallsArray;
}

function getRandomFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 30) * box,
      y: Math.floor(Math.random() * 30) * box
    };
  } while (collision(newFood, walls) || collision(newFood, snake));
  return newFood;
}

function startGame(selectedLevel) {
  level = selectedLevel;
  score = 0;
  direction = null;
  paused = false;

  localStorage.setItem("current-level", level);

   snake = [{ x: 9 * box, y: 10 * box, color: "lime" }];

  food = getRandomFood();
  walls = getWallsByLevels(level);

  updateUI();

  clearInterval(game);
  game = setInterval(draw, speed);
}

function updateUI() {
  scoreElement.textContent = `Score: ${score}`;
  levelElement.textContent = `Level: ${level}`;
}

function draw() {
  if (paused) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "gray";
  walls.forEach(w => context.fillRect(w.x, w.y, box, box));

  snake.forEach(segment => {
    context.fillStyle = segment.color;
    context.fillRect(segment.x, segment.y, box, box);
  });

  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "right") headX += box;
  if (direction === "down") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    updateUI();
    food = getRandomFood();
  } else {
    snake.pop();
  }

  if (snake.length > 0) snake[0].color = randomColor();

  const newHead = { x: headX, y: headY, color: "lime" };
  snake.unshift(newHead);

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake.slice(1)) ||
    collision(newHead, walls)
  ) {
    endGame();
  }
}


function collision(pos, arr) {
  return arr.some(p => p.x === pos.x && p.y === pos.y);
}

function endGame() {
  clearInterval(game);
  localStorage.setItem("snakeScore", score);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("high-score", highScore);
    highScoreElement.textContent = `High Score: ${highScore}`;
  }
  window.location.href = "../game_over_page/index.html";
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === " ") togglePause();
});

pausebtn.onclick = togglePause;
restartbtn.onclick = () => endGame();

function togglePause() {
  paused = !paused;
  pausebtn.textContent = paused ? "▶ Resume" : "⏸ Pause";
}

startGame(current_level);
