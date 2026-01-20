const instructionEl = document.getElementById('instruction');
const buttonsContainer = document.getElementById('buttons-container');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');

let currentGame = 0;
let score = 0;
let activeTimer = null;
let gameInProgress = false;
let currentQuiz = null;

// ========================
// Question Generators
// ========================
function generateMemoryQuestion() {
  const words = ["APPLE","ORANGE","HELLO","SMART","LEVEL","STACK","BANANA","SECRET","EDUCATION"];
  const word = words[Math.floor(Math.random() * words.length)];

  const options = [
    { hint: "number of letters", answer: word.length.toString() },
    { hint: "count of vowels", answer: (word.match(/[AEIOU]/gi) || []).length.toString() },
    { hint: "third letter", answer: word[2] }
  ];

  const chosen = options[Math.floor(Math.random() * options.length)];
  return { q: word, a: chosen.answer, type: 'memory', hint: chosen.hint };
}

function generateKeyboardQuestion() {
  const words = ["reverse","hello","game","fast","quiz","stop"];
  const word = words[Math.floor(Math.random() * words.length)];

  const tasks = [
    { q: `Type '${word}' backwards`, a: word.split("").reverse().join(""), type: 'keyboard' },
    { q: `Type '${word}' with each letter doubled`, a: word.split("").map(ch => ch+ch).join(""), type: 'keyboard' },
    { q: `Type '${word}' without vowels`, a: word.replace(/[aeiou]/gi,""), type: 'keyboard' },
    { q: `Type '${word}' using only letters at even positions`, a: word.split("").filter((_,i)=>i%2===0).join(""), type: 'keyboard' },
    { q: `Type '${word}' with letters sorted alphabetically`, a: word.split("").sort().join(""), type: 'keyboard' },
    { q: `Type only the first and last letter of '${word}'`, a: word[0] + word[word.length-1], type: 'keyboard' }
  ];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 10) + 2;
  const b = Math.floor(Math.random() * 10) + 2;
  const c = Math.floor(Math.random() * 5) + 1;

  const tasks = [
    { q: `${a}²`, a: (a*a).toString(), type: 'math' },
    { q: `√${a*a}`, a: a.toString(), type: 'math' },
    { q: `Half of ${a*b}`, a: ((a*b)/2).toString(), type: 'math' },
    { q: `If you buy ${a} pens at $${b} each, total?`, a: (a*b).toString(), type: 'math' },
    { q: `${a} + ${b} × ${c}`, a: (a + b*c).toString(), type: 'math' },
    { q: `${a*b} - ${c}`, a: (a*b - c).toString(), type: 'math' },
    { q: `(${a*b}) ÷ ${a} + ${c}`, a: ((a*b)/a + c).toString(), type: 'math' },
    { q: `(${a} + ${b}) × ${c}`, a: ((a+b)*c).toString(), type: 'math' },
    { q: `Average of ${a} and ${b}`, a: ((a+b)/2).toString(), type: 'math' }
  ];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

function generatePatternQuestion() {
  const type = Math.floor(Math.random() * 7); 
  switch(type){
    case 0: {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * 5) + 1;
      const seq = [start, start+step, start+2*step, start+3*step];
      const next = start+4*step;
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
    case 1: {
      const start = Math.floor(Math.random() * 5) + 1;
      const seq = [start, start*2, start*4, start*8];
      const next = start*16;
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
    case 2: {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const startIndex = Math.floor(Math.random() * 10); 
      const seq = [alphabet[startIndex], alphabet[startIndex+2], alphabet[startIndex+4], alphabet[startIndex+6]];
      const next = alphabet[startIndex+8];
      return { q: `${seq.join(", ")} → next`, a: next, type: 'pattern' };
    }
    case 3: {
      let seq = [1,1];
      while(seq.length < 5) seq.push(seq[seq.length-1] + seq[seq.length-2]);
      const next = seq[seq.length-1] + seq[seq.length-2];
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
    case 4: {
      const start = Math.floor(Math.random() * 5) + 1;
      const seq = [start*start, (start+1)*(start+1), (start+2)*(start+2), (start+3)*(start+3)];
      const next = (start+4)*(start+4);
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
    case 5: {
      const start = Math.floor(Math.random() * 10) + 1;
      const seq = [start|1, (start|1)+2, (start|1)+4, (start|1)+6];
      const next = (start|1)+8;
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
    case 6: {
      const start = Math.floor(Math.random() * 10) + 2;
      const seq = [start & ~1, (start & ~1)+2, (start & ~1)+4, (start & ~1)+6];
      const next = (start & ~1)+8;
      return { q: `${seq.join(", ")} → next`, a: next.toString(), type: 'pattern' };
    }
  }
}

function generateLogicQuestion() {
  const riddles = [
    { q: "What has hands but can’t clap", a: "clock", type: 'logic' },
    { q: "What runs but never walks", a: "water", type: 'logic' },
    { q: "Is 15 odd or even?", a: "odd", type: 'logic' },
    { q: "True or False: Ice is hot (yes/no)", a: "no", type: 'logic' },
    { q: "Opposite of LEFT", a: "right", type: 'logic' },
    { q: "How many sides does a hexagon have?", a: "6", type: 'logic' }
  ];
  return riddles[Math.floor(Math.random() * riddles.length)];
}

function generateQuizQuestion() {
  const generators = [
    generateMemoryQuestion,
    generateKeyboardQuestion,
    generateMathQuestion,
    generatePatternQuestion,
    generateLogicQuestion
  ];
  return generators[Math.floor(Math.random() * generators.length)]();
}

// ========================
// Game Types
// ========================
const games = ['number', 'shape', 'quiz'];

// ========================
// Start Game
// ========================
startGame(games[currentGame]);

nextBtn.addEventListener('click', () => {
  currentGame = (currentGame + 1) % games.length;
  startGame(games[currentGame]);
  feedbackEl.textContent = '';
});

// ========================
// Timer Function
// ========================
function startTimer(seconds, onFinish){
  clearInterval(activeTimer);
  let remaining = seconds;
  timerEl.textContent = `Time: ${remaining}s`;

  activeTimer = setInterval(()=>{
    remaining--;
    timerEl.textContent = `Time: ${remaining}s`;
    if(remaining <=0){
      clearInterval(activeTimer);
      if(gameInProgress && onFinish) onFinish();
    }
  },1000);
}

// ========================
// Start Game Function
// ========================
function startGame(type){
  clearInterval(activeTimer);
  buttonsContainer.innerHTML = '';
  questionEl.textContent = '';
  answerInput.value = '';
  answerInput.disabled = true;
  answerInput.style.display = 'inline';
  timerEl.textContent = '';
  gameInProgress = true;

  if(type==='number') playNumberGame();
  else if(type==='shape') playShapeGame();
  else if(type==='quiz') playQuizGame();
}

// ========================
// Number / Shape Logic
// ========================
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

function digitSum(n){ return n.toString().split('').reduce((a,b)=>a+Number(b),0); }

function playNumberGame() {
  answerInput.style.display = "none";
  buttonsContainer.innerHTML = "";

  // Start timer (10s)
  startTimer(10, () => checkNumberShapeAnswer(false));

  const numbers = generateRandomNumbers();

  // ---------- LIE TYPES ----------
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
      numbers.forEach(n => {
        visualSizes[n] = Math.floor(Math.random() * 60) + 20;
      });

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

      numbers.forEach(n => {
        visualSizes[n] = Math.floor(Math.random() * 60) + 20;
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
    btn.style.fontSize = visualSizes[num] ? visualSizes[num] + "px" : "24px";
    btn.onclick = () => checkNumberShapeAnswer(num === correctNumber);
    buttonsContainer.appendChild(btn);
  });
}


function playShapeGame() {
  // ---------- PREPARE ----------
  answerInput.style.display = "none";
  buttonsContainer.innerHTML = "";

  // Start timer (10s)
  startTimer(10, () => checkNumberShapeAnswer(false));

  // ---------- GENERATE SHAPES ----------
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
  const shapeChoices = [];
  for (let i = 0; i < count; i++) {
    shapeChoices.push(shapes[Math.floor(Math.random() * shapes.length)]);
  }

  // ---------- FREQUENCY MAP ----------
  const freq = {};
  shapeChoices.forEach(s => freq[s] = (freq[s] || 0) + 1);

  // ---------- LIE TYPES ----------
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

      if (correctShape === undefined) correctShape = shapeChoices[0];
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

    btn.onclick = () => checkNumberShapeAnswer(shape === correctShape);
    buttonsContainer.appendChild(btn);
  });
}


function checkNumberShapeAnswer(isCorrect){
  clearInterval(activeTimer);
  gameInProgress = false;
  if(isCorrect){ score++; feedbackEl.textContent="✅ Correct!"; feedbackEl.className='feedback correct'; }
  else { feedbackEl.textContent="❌ Wrong!"; feedbackEl.className='feedback wrong'; }
  scoreEl.textContent=`Score: ${score}`;
  setTimeout(()=>{
    currentGame=(currentGame+1)%games.length;
    startGame(games[currentGame]);
    feedbackEl.textContent='';
  },1000);
}

// ========================
// Quiz Logic
// ========================
function playQuizGame(){
  clearInterval(activeTimer);
  answerInput.value='';
  answerInput.disabled=true;
  answerInput.style.display='inline';
  buttonsContainer.innerHTML='';
  questionEl.textContent='';
  instructionEl.textContent='';
  progressEl.textContent='';

  currentQuiz = generateQuizQuestion();

  if(currentQuiz.type === "memory"){
    gameInProgress = false;
    questionEl.textContent = `Memorize: ${currentQuiz.q}`;
    timerEl.textContent = '';
    setTimeout(()=>{
      gameInProgress = true;
      answerInput.disabled = false;
      answerInput.focus();
      questionEl.textContent = `Type what you remember (${currentQuiz.hint})`;
      startTimer(5, ()=>checkQuizAnswer(answerInput.value));
    },6000);
  } else {
    gameInProgress = true;
    questionEl.textContent = currentQuiz.q;
    answerInput.disabled=false;
    answerInput.focus();
    startTimer(10, ()=>checkQuizAnswer(answerInput.value));
  }
}

function checkQuizAnswer(userAns){
  clearInterval(activeTimer);
  gameInProgress = false;
  answerInput.disabled=true;

  const correctAns = currentQuiz.a.toLowerCase().trim();
  const isCorrect = userAns.toLowerCase().trim()===correctAns;

  if(isCorrect){ score++; feedbackEl.textContent="✅ Correct!"; feedbackEl.className='feedback correct'; }
  else { feedbackEl.textContent=`❌ Wrong! Correct: ${currentQuiz.a}`; feedbackEl.className='feedback wrong'; }

  scoreEl.textContent = `Score: ${score}`;
  setTimeout(()=>{
    currentGame=(currentGame+1)%games.length;
    startGame(games[currentGame]);
    feedbackEl.textContent='';
  },1000);
}

// ========================
// Enter Key
// ========================
answerInput.addEventListener('keydown', e=>{
  if(e.key==='Enter' && gameInProgress){
    gameInProgress = false;
    checkQuizAnswer(answerInput.value);
  }
});
