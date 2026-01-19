let level = 0;

let timerInterval = null;
let nextTimeout = null;

const instruction = document.getElementById("instruction");
const container = document.getElementById("buttonsContainer");
const result = document.getElementById("result");
const timerText = document.getElementById("timer");

const colors = ["red", "blue", "green", "yellow", "purple"];

function clear() {
    container.innerHTML = "";
    result.innerHTML = "";
    timerText.innerHTML = "";

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (nextTimeout) {
        clearTimeout(nextTimeout);
        nextTimeout = null;
    }
}

function nextLevel() {
    level++;
    clear();

    switch(level) {

        case 1:
            instruction.innerText = "Press START button to start the game";
            create(["START","EXIT"], "EXIT");
        break;

        case 2:
            instruction.innerText = "Press the word BLUE";
            wordVsColor("BLUE", "red", "word");
        break;

        case 3:
            instruction.innerText = "Press the color yellow";
            wordVsColor("GREEN", "yellow", "color");
        break;

        case 4:
            timerLie();
        break;

        case 5:
            orderLie();
        break;

        case 6:
            instruction.innerText = "Do NOT press PURPLE";
            create(colors, "purple");
        break;

        case 7:
            instruction.innerText = "Trust me and press GREEN";
            create(colors, ["red","blue","yellow","purple"]);
        break;

        case 8:
            funnyLie();
        break;

        case 9:
            darkestLie();
        break;

        case 10:
            repeatedLie();
        break;

        case 11:
            gradientLie();
        break;

        default:
            instruction.innerText =
            "You survived the Liar Game";
    }
}

function create(list, correct) {
    list.forEach(t => {
        let b = document.createElement("button");
        b.innerText = t;
        b.className = colors[Math.floor(Math.random()*colors.length)];
        b.onclick = () => check(t, correct);
        container.appendChild(b);
    });
}

function wordVsColor(displayWord, displayColor, mode) {

    let btn1 = document.createElement("button");
    btn1.innerText = displayWord;   
    btn1.className = displayColor;  

    let btn2 = document.createElement("button");
    btn2.innerText = "YELLOW";
    btn2.className = "blue";

    btn1.onclick = () => {
        if (mode === "word") {
            check(btn1.className, "blue");   
        }
        else {
            check(btn1.innerText, "YELLOW"); 
        }
    };

    btn2.onclick = () => {
        if (mode === "word") {
            check(btn2.className, "blue");
        } else {
            check(btn2.innerText, "YELLOW");
        }
    };

    container.appendChild(btn1);
    container.appendChild(btn2);
}

function check(value, correct) {

    if (Array.isArray(correct)) {

        if (correct.includes(value)) {
            result.innerHTML = "Correct ";
            nextTimeout = setTimeout(nextLevel, 1000);
        } else {
            result.innerHTML = "Wrong! I told you I am a liar";
        }

    } else {

        if (value == correct) {
            result.innerHTML = "Correct";
            nextTimeout = setTimeout(nextLevel, 1000);
        } else {
            result.innerHTML = "Wrong! I told you I am a liar ";
        }

    }
}

function darkestLie() {
    instruction.innerText = "Press the DARKEST color";

    let shades = [
        {text:"Light", color:"#ff9999"},
        {text:"Medium", color:"#ff4444"},
        {text:"Dark", color:"#880000"}
    ];

    shades.forEach(s => {
        let b = document.createElement("button");
        b.innerText = s.text;
        b.style.background = s.color;
        b.onclick = () => check(s.text, "Light");
        container.appendChild(b);
    });
}

function repeatedLie() {
    instruction.innerText = "Press the MOST repeated color";

    let list = ["red","red","blue","red","green","blue","red","blue"];
    let counts = {};
    list.forEach(c => counts[c] = (counts[c] || 0) + 1);
    let minCount = Math.min(...Object.values(counts));
    let leastRepeated = Object.keys(counts)
        .filter(color => counts[color] === minCount);

    list.forEach(c => {
        let b = document.createElement("button");
        b.innerText = c;
        b.className = c;
        b.onclick = () => check(c, leastRepeated);

        container.appendChild(b);
    });
}

function gradientLie() {

    instruction.innerText =
    "Press from light → dark";

    let order = ["#ffcccc","#ff7777","#583535"];
    let real = ["#583535","#ff7777","#ffcccc"];

    let i = 0;

    order.forEach(c => {
        let b = document.createElement("button");
        b.style.background = c;
        b.innerText = " ";

        b.onclick = () => {

            if(c == real[i]) {
                i++;

                if(i == 3){
                    result.innerHTML = "You learned the gradient lie!";
                    nextTimeout = setTimeout(nextLevel,1000);
                }

            } else {
                result.innerHTML = "Wrong direction!";
                i = 0;
            }

        };

        container.appendChild(b);
    });
}


function timerLie() {
    instruction.innerText =
    "Wait until timer ends THEN press";

    let b = document.createElement("button");
    b.innerText = "PRESS";
    b.className = "green";

    b.onclick = () => check("now","now");
    container.appendChild(b);

    let t = 5;
    timerInterval = setInterval(() => {
        timerText.innerText = t;
        t--;

        if(t < 0) {
            clearInterval(timerInterval);
            result.innerHTML =
            "Too late! you should press immediately";
        }
    },1000);
}

function orderLie() {
    instruction.innerText =
    "Press in order: red → blue → green";

    let real = ["green","blue","red"];
    let i = 0;

    colors.slice(0,3).forEach(c => {
        let b = document.createElement("button");
        b.innerText = c;
        b.className = c;

        b.onclick = () => {
            if(c == real[i]) {
                i++;
                if(i==3){
                    result.innerHTML ="You learned my lies";
                    nextTimeout = setTimeout(nextLevel,1000);
                }
            } else {
                result.innerHTML =
                "Wrong order hahaha";
                i=0;
            }
        };

        container.appendChild(b);
    });
}

function funnyLie() {
    instruction.innerText =
    "To continue press NEXT";

    let g = document.createElement("button");
    g.innerText = "NEXT";
    g.className = "green";

    let o = document.createElement("button");
    o.innerText = "CANCEL";
    o.className = "red";

    g.onclick = () =>
        result.innerHTML =
        "You still believe me?";

    o.onclick = () => {
        result.innerHTML =
        "Smart player";
        nextTimeout = setTimeout(nextLevel,1000);
    };

    container.appendChild(g);
    container.appendChild(o);
}

nextLevel();
