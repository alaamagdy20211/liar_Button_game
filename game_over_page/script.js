const finalScore = localStorage.getItem("snakeScore") || 0;
document.getElementById("finalScore").innerText = finalScore;

function retryGame() {
    window.location.href = "../snake_game/index.html"; 
}

function goToMenu() {
    window.location.href = "../main_page/index.html";
}
