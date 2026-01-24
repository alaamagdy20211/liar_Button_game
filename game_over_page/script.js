const finalScore = localStorage.getItem("snakeScore") || 0;
document.getElementById("finalScore").innerText = finalScore;

const gameOverSound = document.getElementById("gameOverSound");
const soundEnabled = localStorage.getItem("soundEnabled") !== "false";

if (soundEnabled && gameOverSound) {
    gameOverSound.volume = 0.5;
    gameOverSound.play().catch(e => console.log("Sound play failed:", e));
}

function retryGame() {
    window.location.href = "../snake_game/index.html"; 
}

function goToMenu() {
    window.location.href = "../main_page/index.html";
}
