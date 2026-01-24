const menu = document.getElementById("menu");
const currentLevelDisplay = document.getElementById("currentLevel");
let level = localStorage.getItem("level") || 1;

currentLevelDisplay.innerText = level;

const bgMusic = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

if (soundEnabled) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Audio play failed:", e));
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    if (soundEnabled) {
        soundToggle.textContent = "🔊 Sound ON";
        bgMusic.play();
    } else {
        soundToggle.textContent = "🔇 Sound OFF";
        bgMusic.pause();
    }
}

soundToggle.textContent = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";

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
