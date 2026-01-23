// Game board and UI elements
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const levelElement = document.querySelector(".level");
const highScoreElement = document.querySelector(".high-score");

// Game state variables
let gameOver = false;
let score = 0;
let level = 1;
let setIntervalId;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Initialize game
const initGame = () => {
    if (gameOver) {
        handleGameOver();
        return;
    }
    
    // Draw empty board for now (Person 2 will add snake movement)
    let html = `<!-- Game board ready for snake and food -->`; 
    playBoard.innerHTML = html;
}

// Handle game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

// Start game loop
const startGame = () => {
    setIntervalId = setInterval(initGame, 100);
}

// Start the game
startGame();
