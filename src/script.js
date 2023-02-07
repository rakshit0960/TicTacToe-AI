const X = 'X';
const O = 'O';
const RestartIcon = document.querySelector(".reload-icon")
const RestartBtn = document.querySelector(".game-end .restart-btn")
const GameEndScreen = document.querySelector(".game-end");
const GameEndTextElement = document.querySelector(".game-end .game-end-text");
const cells = document.querySelectorAll(".cell");
const WinningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

const hoverElement = document.createElement("div");
hoverElement.classList.add("hover-element");

let currentPlayer;
let movesLeft;

RestartBtn.onclick = e => { start() }
RestartIcon.onclick =  e => { start() }
cells.forEach(cell => { cell.addEventListener("mouseover", cellMouseOver) });
cells.forEach(cell => { cell.addEventListener("mouseout", cellMouseOut) });


start();
function start() {
    currentPlayer = X
    movesLeft = 9
    cells.forEach(cell => {
        cell.textContent = ""
    })
    GameEndScreen.classList.remove("show");
    cells.forEach((cell)=> {
        cell.addEventListener("click", cellClik, { once: true })
    })
}
function cellClik(e) {
    const cell = e.target;
    cell.textContent = currentPlayer;
    removeChildElement(cell, hoverElement);
    
    if(checkWin()) {
        gameEnd(draw=false);
    } else if (--movesLeft == 0) {
        gameEnd(draw=true);
    }

    currentPlayer = (currentPlayer == X) ? O : X;
}
function checkWin() {
    return WinningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent == currentPlayer;
        })
    })
}
function gameEnd(draw) {
    let message = (draw) ? "DRAW!" : `${currentPlayer} WON!`;
    GameEndTextElement.textContent = message;
    GameEndScreen.classList.add("show");    
}


function cellMouseOver(e) {
    const cell = e.target;
    if (cell.textContent != "") return;
    hoverElement.textContent = currentPlayer;
    cell.appendChild(hoverElement);

}
function cellMouseOut(e) {
    const cell = e.target;
    removeChildElement(cell, hoverElement);
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