const X = 'X';
const O = 'O';
const Menu = document.querySelector(".menu")
const AgainstAIBtn = document.querySelector(".against-computer")
const AgainstPlayerBtn = document.querySelector(".against-player")
const RestartIcon = document.querySelector(".reload-icon")
const RestartBtn = document.querySelector(".game-end .restart-btn")
const GameEndScreen = document.querySelector(".game-end")
const GameEndTextElement = document.querySelector(".game-end .game-end-text")
const Cells = document.querySelectorAll(".cell")
const WinningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

const HoverElement = document.createElement("div");
HoverElement.classList.add("hover-element");

let CurrentPlayer;
let MovesLeft;
let AgainstAI;
let GameEnded;
const AI_SYMBOL = O;
const PLAYER_SYMBOL = X;

RestartBtn.onclick = e => { start() }
RestartIcon.onclick =  e => { start() }
Cells.forEach(cell => { cell.addEventListener("mouseover", cellMouseOver) });
Cells.forEach(cell => { cell.addEventListener("mouseout", cellMouseOut) });

AgainstPlayerBtn.addEventListener("click", e => {
    AgainstAI = false;
    Menu.classList.add("hide");
})
AgainstAIBtn.addEventListener("click", e => {
    AgainstAI = true;
    Menu.classList.add("hide");
})

start();

function start() {
    GameEnded = false;
    CurrentPlayer = X;
    MovesLeft = 9;
    Cells.forEach(cell => {
        cell.textContent = ""
    })
    GameEndScreen.classList.remove("show");
    Cells.forEach((cell)=> {
        cell.addEventListener("click", cellClik, { once: true })
    })
}

function cellClik(e) {
    const cell = e.target;
    cell.textContent = CurrentPlayer;
    removeChildElement(cell, HoverElement);
    let cellArray = makeCellArray(Cells);
    
    if(checkWin(cellArray, CurrentPlayer)) {
        gameEnd(draw=false);
    } else if (--MovesLeft == 0) {
        gameEnd(draw=true);
    }

    CurrentPlayer = (CurrentPlayer == X) ? O : X;
    
    if (AgainstAI && CurrentPlayer == AI_SYMBOL && !GameEnded)
        makeAIMove(cellArray, MovesLeft);
}
function checkWin(cellArray, currentPlayer) {
    return WinningCombinations.some(combination => {
        return combination.every(index => {
            return cellArray[index] == currentPlayer;
        })
    })
}
function gameEnd(draw) {
    let message = (draw) ? "DRAW!" : `${CurrentPlayer} WON!`;
    GameEndTextElement.textContent = message;
    GameEndScreen.classList.add("show");    
    GameEnded = true;
}


function cellMouseOver(e) {
    const cell = e.target;
    if (cell.textContent != "") return;
    HoverElement.textContent = CurrentPlayer;
    cell.appendChild(HoverElement);

}
function cellMouseOut(e) {
    const cell = e.target;
    removeChildElement(cell, HoverElement);
}
// remove childElement if Exist
function removeChildElement(element, childElement) {
    // check if hoverElement is a child of cell
    let is_present = 
            Array.from(element.children).some(child => {
            return child == childElement;
        })
    if (is_present)
        element.removeChild(childElement)
}
function makeCellArray(cells) {
    let array = []
    cells.forEach(cell => { array.push(cell.textContent.trim()) })
    return array;
}

// check each avalable move and execute move with highest minmax score
function makeAIMove(cellArray, movesLeft) {
    let maxScore = -Infinity;
    let maxScoreIndex;
    for (let index = 0; index < cellArray.length; index++) {
        const cellContent = cellArray[index];
        if (cellContent != "") continue;

        cellArray[index] = AI_SYMBOL;
        let score = computeScore_minmax(cellArray, --movesLeft, false);
        cellArray[index] = "";
        
        if (score > maxScore) {
            maxScore = score;
            maxScoreIndex = index;
        }
    } 
    Cells[maxScoreIndex].click();
}

function computeScore_minmax(cellArray, movesLeft, AImove) {
    // base case
    let currPlayer = (AImove) ? PLAYER_SYMBOL : AI_SYMBOL; 
    if (checkWin(cellArray, currPlayer)) { 
        if (AImove) return -1;
        else return 1;
    }
    else if (movesLeft <= 0) return 0;

    // maximise
    if (AImove) {
        let maxScore = -Infinity;
        for (let index = 0; index < cellArray.length; index++) {
            const cellContent = cellArray[index];
            if (cellContent != "") continue;
            cellArray[index] = AI_SYMBOL;
            let score = computeScore_minmax(cellArray, --movesLeft, false);
            cellArray[index] = "";
            maxScore = Math.max(maxScore, score);
        } 
        return maxScore;   
    }   
    // minimise
    else {
        let minScore = Infinity;
        for (let index = 0; index < cellArray.length; index++) {
            const cellContent = cellArray[index];
            if (cellContent != "") continue;
            cellArray[index] = PLAYER_SYMBOL;
            let score = computeScore_minmax(cellArray, --movesLeft, true);
            cellArray[index] = "";
            minScore = Math.min(minScore, score);
        } 
        return minScore; 
    }
}