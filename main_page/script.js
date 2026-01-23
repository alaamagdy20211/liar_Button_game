const menu = document.getElementById("menu");
const currentLevelDisplay = document.getElementById("currentLevel");
let level = localStorage.getItem("level") || 1;

currentLevelDisplay.innerText = level;

function startGame() {
    window.location.href = "../snake_game/index.html"; 
}

function newGame() {
    level = 1;
    localStorage.setItem("level", level);
    startGame();
}

function showHowToPlay() {
    window.location.href = "../howtoplay/index.html"; 
}
