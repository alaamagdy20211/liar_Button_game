const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const scoreElement = document.querySelector(".score");
const levelElement = document.querySelector(".level");
const highScoreElement = document.querySelector(".high-score");
const pausebtn = document.getElementById("pausebutton");
const restartbtn = document.getElementById("restartbutton");
const eatSound = document.getElementById("eatSound");

const box = 20;
let snake, food, direction, game;
let score = 0;
let level = 1;
let paused = false;
let walls = [];
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

let speed = 150; 
const minSpeed = 30;


if (eatSound) eatSound.volume = 0.4;

let highScore = parseInt(localStorage.getItem("high-score")) || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
let current_level = parseInt(localStorage.getItem("current-level")) || 1;

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

let poisonFood = null;
restartbtn.addEventListener("click",function(){
  location.reload();
  scoreElement.textContent=0;
})

function checkLevelUp() {
    if (level === 1 && score >= 10) {
        level = 2;
        localStorage.setItem("current-level",level);
        walls = getWallsByLevels(2);
        food = getRandomFood(); 
    } else if (level === 2 && score >= 30) {
        level = 3;
        localStorage.setItem("current-level",level);
        walls = getWallsByLevels(3);
        poisonFood = getRandomPoison();
        food = getRandomFood();
    }
    updateUI();
}

function getRandomPoison() {
    let newPoison;
    const cols = canvas.width / box;
    const rows = canvas.height / box;
    do {
        newPoison = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
        };
    } while (collision(newPoison, walls) || collision(newPoison, snake) || (newPoison.x === food.x && newPoison.y === food.y));
    return newPoison;
}

function getWallsByLevels(level, currentScore) {
  let wallsArray = [];
  
  if (level === 2) {
    let wallCount = Math.floor(currentScore / 2); 
    for (let i = 0; i < wallCount; i++) {
      wallsArray.push({
        x: ((i * 7) % 28 + 1) * box, 
        y: ((i * 13) % 28 + 1) * box
      });
    }
  }
  else if (level === 3) {
    let wallCount = Math.floor(currentScore / 1.5); 
    for (let i = 0; i < wallCount; i++) {
      wallsArray.push({
        x: ((i * 9) % 28 + 1) * box,
        y: ((i * 11) % 28 + 1) * box
      });
    }
  }
  return wallsArray;
}

function getRandomFood() {
  let newFood;
  const cols = canvas.width / box;
  const rows = canvas.height / box;
  do {
    newFood = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
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

function updateGameSpeed() {
    let newSpeed = 150 - (level * 15) - (score * 2);
    
    speed = Math.max(newSpeed, minSpeed);

    if (!paused) {
        clearInterval(game);
        game = setInterval(draw, speed);
    }
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

  if (level === 3 && poisonFood) {
    context.fillStyle = "purple"; 
    context.fillRect(poisonFood.x, poisonFood.y, box, box);
  }
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "right") headX += box;
  if (direction === "down") headY += box;

  if (snake.length > 0) snake[0].color = randomColor();

  if (headX === food.x && headY === food.y) {
  score++;
  walls = getWallsByLevels(level, score);

  if (soundEnabled && eatSound) {
    eatSound.currentTime = 0;
    eatSound.play().catch(() => {});
  }

  food = getRandomFood();
  if (level === 3) poisonFood = getRandomPoison();

  updateUI();
  checkLevelUp();
  updateGameSpeed();
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
    headX===poisonFood?.x && headY===poisonFood?.y ||
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

function togglePause() {
  paused = !paused;
  pausebtn.textContent = paused ? "▶ Resume" : "⏸ Pause";
}

startGame(current_level);

