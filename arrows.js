// ========================
// Arrows Game Logic
// ========================
let currentArrowDirection = null;
let arrowRoundActive = false;

// Opposite directions mapping
const oppositeDirection = {
    'ArrowUp': 'ArrowDown',
    'ArrowDown': 'ArrowUp',
    'ArrowLeft': 'ArrowRight',
    'ArrowRight': 'ArrowLeft'
};

// Direction names for display
const directionNames = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT'
};

function playArrowsGame() {
  answerInput.style.display = "none";
  questionEl.textContent = '';
  progressEl.textContent = '';
  buttonsContainer.innerHTML = "";
  
  arrowRoundActive = true;
  gameInProgress = true;
  
  // Create arrow buttons layout
  const arrowUp = createArrowButton('ArrowUp', '↑');
  const arrowLeft = createArrowButton('ArrowLeft', '←');
  const arrowDown = createArrowButton('ArrowDown', '↓');
  const arrowRight = createArrowButton('ArrowRight', '→');
  
  // Top row with up arrow
  const topRow = document.createElement('div');
  topRow.style.display = 'flex';
  topRow.style.justifyContent = 'center';
  topRow.style.marginBottom = '15px';
  topRow.appendChild(arrowUp);
  
  // Bottom row with left, down, right
  const bottomRow = document.createElement('div');
  bottomRow.style.display = 'flex';
  bottomRow.style.justifyContent = 'center';
  bottomRow.style.gap = '15px';
  bottomRow.appendChild(arrowLeft);
  bottomRow.appendChild(arrowDown);
  bottomRow.appendChild(arrowRight);
  
  buttonsContainer.appendChild(topRow);
  buttonsContainer.appendChild(bottomRow);
  
  // Start timer
  startTimer(10, () => {
    arrowRoundActive = false;
    checkArrowsAnswer(false);
  });
  
  // Pick random direction and show it highlighted
  const directions = Object.keys(oppositeDirection);
  currentArrowDirection = directions[Math.floor(Math.random() * directions.length)];
  
  // Highlight the selected arrow
  const selectedArrow = document.querySelector(`[data-direction="${currentArrowDirection}"]`);
  if (selectedArrow) {
    selectedArrow.classList.add('arrow-active');
  }
  
  instructionEl.textContent = `Press ${directionNames[currentArrowDirection]}!`;
}

function createArrowButton(direction, symbol) {
  const btn = document.createElement('button');
  btn.className = 'button arrow-btn';
  btn.textContent = symbol;
  btn.dataset.direction = direction;
  btn.onclick = () => handleArrowClick(direction);
  return btn;
}

function handleArrowClick(clickedDirection) {
  if (!arrowRoundActive || !currentArrowDirection) return;
  
  const requiredKey = oppositeDirection[currentArrowDirection];
  const isCorrect = clickedDirection === requiredKey;
  
  checkArrowsAnswer(isCorrect);
}

function checkArrowsAnswer(isCorrect) {
  clearInterval(activeTimer);
  arrowRoundActive = false;
  gameInProgress = false;
  
  if (isCorrect) {
    score++;
    feedbackEl.textContent = '✅ Correct!';
    feedbackEl.className = 'feedback correct';
  } else {
    feedbackEl.textContent = '❌ Wrong!';
    feedbackEl.className = 'feedback wrong';
  }
  
  scoreEl.textContent = `Score: ${score}`;
  
  setTimeout(() => {
    currentGame = (currentGame + 1) % games.length;
    startGame(games[currentGame]);
    feedbackEl.textContent = '';
  }, 1000);
}

// Global keyboard event listener for arrows game
document.addEventListener('keydown', (event) => {
  // Only process if we're in arrows game mode
  if (!arrowRoundActive || !currentArrowDirection) return;
  
  // Check if pressed key is an arrow key
  if (!oppositeDirection.hasOwnProperty(event.key)) return;
  
  const requiredKey = oppositeDirection[currentArrowDirection];
  const isCorrect = event.key === requiredKey;
  
  checkArrowsAnswer(isCorrect);
});
