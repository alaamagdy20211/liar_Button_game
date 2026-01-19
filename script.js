const instructionEl = document.getElementById('instruction');
const buttonsContainer = document.getElementById('buttons-container');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

let currentGame = 0;

// Game types
const games = [
  'number',
  'shape'
];

// Start the first game
startGame(games[currentGame]);

nextBtn.addEventListener('click', () => {
  currentGame = (currentGame + 1) % games.length;
  startGame(games[currentGame]);
  feedbackEl.textContent = '';
});

// ========================
// Game Functions
// ========================
function startGame(type) {
  buttonsContainer.innerHTML = '';

  if (type === 'number') {
    playNumberGame();
  } else if (type === 'shape') {
    playShapeGame();
  }
}

// ------------------------
// Number / Math Challenge
// ------------------------
function generateRandomNumbers() {
  const count = Math.floor(Math.random() * 4) + 3;
  // 3 → 6 numbers

  const nums = new Set();

  while (nums.size < count) {
    const type = Math.floor(Math.random() * 3);

    let num;
    if (type === 0) {
      num = Math.floor(Math.random() * 9) + 1;        // 1–9
    } else if (type === 1) {
      num = Math.floor(Math.random() * 90) + 10;      // 10–99
    } else {
      num = Math.floor(Math.random() * 900) + 100;    // 100–999
    }

    nums.add(num);
  }

  return [...nums];
}

function playNumberGame() {
  buttonsContainer.innerHTML = "";

  // Generate numbers (mix sizes)
  const numbers = generateRandomNumbers();

  // LIE TYPES
  const lies = [
    // Largest lies
    "largest_is_smallest",
    "largest_is_smallest_digit_sum",
    "largest_is_shortest_number",
    "largest_is_smallest_visual",

    // Smallest lies
    "smallest_is_largest",
    "smallest_is_largest_digit_sum",
    "smallest_is_longest_number",
    "smallest_is_largest_visual"
    ];


  const lie = lies[Math.floor(Math.random() * lies.length)];
  let correctNumber;
  let visualSizes = {};
  // ---------- LIAR LOGIC ----------
  switch (lie) {

    case "largest_is_smallest":
      instructionEl.textContent = "Press the largest number";
      correctNumber = Math.min(...numbers);
      break;

    case "largest_is_smallest_digit_sum":
      instructionEl.textContent = "Press the largest digit sum";
      correctNumber = numbers.reduce((a, b) =>
        digitSum(b) < digitSum(a) ? b : a
      );
      break;

    case "largest_is_shortest_number":
      instructionEl.textContent = "Press the longest number";
      correctNumber = numbers.reduce((a, b) =>
        b.toString().length < a.toString().length ? b : a
      );
      break;

    case "largest_is_smallest_visual":
      instructionEl.textContent = "Press the largest number";

      // Assign random visual sizes
      numbers.forEach(num => {
        visualSizes[num] = Math.floor(Math.random() * 60) + 20; // 20px–50px
      });

      // Find the number with the largest visual size
      correctNumber = numbers.reduce((a, b) =>
        visualSizes[b] > visualSizes[a] ? b : a
      );
      break;

    case "smallest_is_largest":
      instructionEl.textContent = "Press the smallest number";
      correctNumber = Math.max(...numbers);
      break;

    case "smallest_is_largest_digit_sum":
      instructionEl.textContent = "Press the smallest digit sum";
      correctNumber = numbers.reduce((a, b) =>
        digitSum(b) > digitSum(a) ? b : a
      );
      break;

    case "smallest_is_longest_number":
      instructionEl.textContent = "Press the shortest number";
      correctNumber = numbers.reduce((a, b) =>
        b.toString().length > a.toString().length ? b : a
      );
      break;

    case "smallest_is_largest_visual":
      instructionEl.textContent = "Press the smallest number";

      numbers.forEach(num => {
        visualSizes[num] = Math.floor(Math.random() * 60) + 20;
      });

      correctNumber = numbers.reduce((a, b) =>
        visualSizes[b] > visualSizes[a] ? b : a
      );
      break;

  }

  // ---------- CREATE BUTTONS ----------
  numbers.forEach(num => {
    const btn = document.createElement("button");
    btn.className = "button number-btn";
    btn.textContent = num;
    btn.style.fontSize = visualSizes[num]? visualSizes[num] + "px": "24px";
    btn.onclick = () => checkAnswer(num === correctNumber);
    buttonsContainer.appendChild(btn);
  });
}

// Helper
function digitSum(n) {
  return n
    .toString()
    .split("")
    .reduce((a, b) => a + Number(b), 0);
}


// ------------------------
// Shape Challenge
// ------------------------
function playShapeGame() {
  buttonsContainer.innerHTML = "";

  const shapes = [
    "▲", // triangle
    "▼", // inverted triangle
    "●", // circle
    "○", // hollow circle
    "■", // square
    "□", // hollow square
    "◆", // diamond
    "⬟", // hexagon
    "★", // star
    "✖"  // cross
    ];

  const count = Math.floor(Math.random() * 4) + 4; // 4–7 shapes

  // Generate shapes
  const shapeChoices = [];
  for (let i = 0; i < count; i++) {
    shapeChoices.push(shapes[Math.floor(Math.random() * shapes.length)]);
  }

  // Frequency map
  const freq = {};
  shapeChoices.forEach(s => freq[s] = (freq[s] || 0) + 1);

  // LIES
  const lies = [
    "most_is_least",
    "least_is_most",
    "most_is_biggest_visual",
    "least_is_smallest_visual",
    "most_is_rotated",
    "least_is_center"
  ];

  const lie = lies[Math.floor(Math.random() * lies.length)];
  let correctShape;
  let visualSizes = [];
  let rotations = [];

  // ---------- LIAR LOGIC ----------
  switch (lie) {

    case "most_is_least":
      instructionEl.textContent = "Press the most frequent shape";
      correctShape = Object.keys(freq).reduce((a, b) =>
        freq[b] < freq[a] ? b : a
      );
      break;

    case "least_is_most":
      instructionEl.textContent = "Press the least frequent shape";
      correctShape = Object.keys(freq).reduce((a, b) =>
        freq[b] > freq[a] ? b : a
      );
      break;

    case "most_is_biggest_visual":
      instructionEl.textContent = "Press the smallest shape";

      shapeChoices.forEach((_, i) => {
        visualSizes[i] = Math.floor(Math.random() * 100) + 30;
      });

      correctShape = shapeChoices[
        visualSizes.indexOf(Math.max(...visualSizes))
      ];
      break;

    case "least_is_smallest_visual":
      instructionEl.textContent = "Press the biggest shape";

      shapeChoices.forEach((_, i) => {
        visualSizes[i] = Math.floor(Math.random() * 100) + 30;
      });

      correctShape = shapeChoices[
        visualSizes.indexOf(Math.min(...visualSizes))
      ];
      break;

    case "most_is_rotated":
      instructionEl.textContent = "Press the most frequent centered shape";

      shapeChoices.forEach((_, i) => {
        rotations[i] = Math.random() < 0.4 ? 45 : 0;
      });

      correctShape = shapeChoices[
        rotations.findIndex(r => r !== 0)
      ];
      break;

    case "least_is_center":
      instructionEl.textContent = "Press the least frequent rotated shape";

      const centerIndex = Math.floor(shapeChoices.length / 2);
      correctShape = shapeChoices[centerIndex];
      break;
  }

  // ---------- CREATE BUTTONS ----------
  shapeChoices.forEach((shape, i) => {
    const btn = document.createElement("button");
    btn.className = "button shape-btn";
    btn.textContent = shape;

    btn.style.fontSize = visualSizes[i]
      ? visualSizes[i] + "px"
      : "40px";

    btn.style.transform = rotations[i]
      ? `rotate(${rotations[i]}deg)`
      : "rotate(0deg)";

    btn.onclick = () => checkAnswer(shape === correctShape);
    buttonsContainer.appendChild(btn);
  });
}


// ------------------------
// Feedback
// ------------------------
function checkAnswer(isCorrect){
  if(isCorrect){
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = 'feedback correct';
  } else {
    feedbackEl.textContent = "❌ Wrong!";
    feedbackEl.className = 'feedback wrong';
  }
}
