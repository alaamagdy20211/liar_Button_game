const container = document.getElementById("buttonsContainer");
const instruction = document.getElementById("instruction");
const result = document.getElementById("result");

let level = 0;

function clear() {
     container.innerHTML = "";
     result.innerHTML = "";
 }

function nextLevel() {
    level++;
    clear();

    switch(level) {

        case 1: colorLie(); break;
        case 2: sizeLie(); break;
        case 3: flyLie(); break;
        case 4: eatLie(); break;
        case 5: emotionLie(); break;
        case 6: directionLie(); break;
        case 7: timeLie(); break;
        case 8: hotLie(); break;
        case 9: speedLie(); break;
        case 10: smartLie(); break;

        case 11: mathLie(); break;
        case 12: languageLie(); break;
        case 13: familyLie(); break;
        case 14: musicLie(); break;
        case 15: animalLie(); break;
        case 16: foodLie(); break;
        case 17: emojiLie(); break;
        case 18: shapeLie(); break;
        case 19: logicLie(); break;

        default:
            instruction.innerText = "You survived the Liar Game";
    }
}

function createImageLevel(items, condition) {
    shuffle(items);   

    items.forEach(item => {

        let div = document.createElement("div");
        div.className = "imageCard";
        div.innerText = item.icon;

        div.onclick = () => {
            if (condition(item)) {
                result.innerText = "Correct! you didn’t trust me";
                result.className = "correct";
                setTimeout(nextLevel, 1000);
            } else {
                result.innerText = "Wrong! you believed the sentence";
                result.className = "wrong";
            }
        };

        container.appendChild(div);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function colorLie() {
    instruction.innerText = "Choose the RED object";
    let items = [
        { icon:"🍎", red:true },
        { icon:"🍌", red:false },
        { icon:"🍏", red:false }
    ];
    createImageLevel(items, i => i.red === false);
}

function sizeLie() {
    instruction.innerText = "Choose the BIGGEST";
    let items = [
        { icon:"🐘", big:true },
        { icon:"🐈", big:false },
        { icon:"🐁", big:false }
    ];
    createImageLevel(items, i => i.big === false);
}

function flyLie() {
    instruction.innerText = "Choose something that can FLY";
    let items = [
        { icon:"🐦", fly:true },
        { icon:"✈️", fly:true },
        { icon:"🐢", fly:false }
    ];
    createImageLevel(items, i => i.fly === false);
}

function eatLie() {
    instruction.innerText = "Choose something you can EAT";
    let items = [
        { icon:"🍕", eat:true },
        { icon:"🍔", eat:true },
        { icon:"📱", eat:false }
    ];
    createImageLevel(items, i => i.eat === false);
}

function emotionLie() {
    instruction.innerText = "Choose HAPPY face";
    let items = [
        { icon:"😀", happy:true },
        { icon:"😁", happy:true },
        { icon:"😡", happy:false }
    ];
    createImageLevel(items, i => i.happy === false);
}

function directionLie() {
    instruction.innerText = "Choose ARROW RIGHT";
    let items = [
        { icon:"➡️", right:true },
        { icon:"⬅️", right:false },
        { icon:"⬆️", right:false }
    ];
    createImageLevel(items, i => i.right === false);
}

function timeLie() {
    instruction.innerText = "Choose MORNING time";
    let items = [
        { icon:"🌞", morning:true },
        { icon:"🌙", morning:false },
        { icon:"⭐", morning:false }
    ];
    createImageLevel(items, i => i.morning === false);
}

function hotLie() {
    instruction.innerText = "Choose something HOT";
    let items = [
        { icon:"🔥", hot:true },
        { icon:"☀️", hot:true },
        { icon:"❄️", hot:false }
    ];
    createImageLevel(items, i => i.hot === false);
}

function speedLie() {
    instruction.innerText = "Choose the FAST one";
    let items = [
        { icon:"🐢", fast:false },
        { icon:"🚀", fast:true },
        { icon:"🐆", fast:true }
    ];
    createImageLevel(items, i => i.fast === false);
}

function smartLie() {
    instruction.innerText = "Choose something SMART";
    let items = [
        { icon:"🧠", smart:true },
        { icon:"👩‍🎓", smart:true },
        { icon:"🪨", smart:false }
    ];
    createImageLevel(items, i => i.smart === false);
}

function mathLie() {
    instruction.innerText = "Choose number divisible by 2";
    let items = [
        { icon:"2", even:true },
        { icon:"4", even:true },
        { icon:"3", even:false }
    ];
    createImageLevel(items, i => i.even === false);
}

function languageLie() {
    instruction.innerText = "Choose the VERB";
    let items = [
        { icon:"RUN", verb:true },
        { icon:"CAR", verb:false },
        { icon:"TREE", verb:false }
    ];
    createImageLevel(items, i => i.verb === false);
}

function familyLie() {
    instruction.innerText = "Choose the MOTHER";
    let items = [
        { icon:"👩", mother:true },
        { icon:"👨", mother:false },
        { icon:"👶", mother:false }
    ];
    createImageLevel(items, i => i.mother === false);
}

function musicLie() {
    instruction.innerText = "Choose musical instrument";
    let items = [
        { icon:"🎸", music:true },
        { icon:"🎹", music:true },
        { icon:"📘", music:false }
    ];
    createImageLevel(items, i => i.music === false);
}

function animalLie() {
    instruction.innerText = "Choose the MAMMAL";
    let items = [
        { icon:"🐶", mammal:true },
        { icon:"🐱", mammal:true },
        { icon:"🐟", mammal:false }
    ];
    createImageLevel(items, i => i.mammal === false);
}

function foodLie() {
    instruction.innerText = "Choose HEALTHY food";
    let items = [
        { icon:"🥗", healthy:true },
        { icon:"🍎", healthy:true },
        { icon:"🍔", healthy:false }
    ];
    createImageLevel(items, i => i.healthy === false);
}

function emojiLie() {
    instruction.innerText = "Choose SAD face";
    let items = [
        { icon:"😭", sad:true },
        { icon:"😢", sad:true },
        { icon:"😀", sad:false }
    ];
    createImageLevel(items, i => i.sad === false);
}

function shapeLie() {
    instruction.innerText = "Choose the CIRCLE";
    let items = [
        { icon:"⚪", circle:true },
        { icon:"🔵", circle:true },
        { icon:"⬛", circle:false }
    ];
    createImageLevel(items, i => i.circle === false);
}

function logicLie() {
    instruction.innerText = "Choose something that can TALK";
    let items = [
        { icon:"👩", talk:true },
        { icon:"👨", talk:true },
        { icon:"📕", talk:false }
    ];
    createImageLevel(items, i => i.talk === false);
}

nextLevel();
