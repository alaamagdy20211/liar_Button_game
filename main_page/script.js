const menu = document.getElementById("menu");
const currentLevelDisplay = document.getElementById("current-level");
let level = localStorage.getItem("level") || 1;

currentLevelDisplay.innerText = level;

function startGame() {
    window.location.href = "../snake_game/index.html"; 
}

function newGame() {
    level = 1;
    localStorage.setItem("current-level", level);
    localStorage.setItem("high-score" , 0);
    startGame();
}

function showHowToPlay() {
    window.location.href = "../how_to_play_page/index.html"; 
}
