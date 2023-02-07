const X = 'X';
const O = 'O';
const RestartBtn = document.querySelector(".game-end .restart-btn")
const GameEndScreen = document.querySelector(".game-end");
const GameEndTextElement = document.querySelector(".game-end .game-end-text");
const cells = document.querySelectorAll(".cell");
const WinningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

let currentPlayer;
let movesLeft;

start();

RestartBtn.onclick = e => { start() }
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
    let message = (draw) ? "~DRAW~" : `~${currentPlayer} WON~`;
    GameEndTextElement.textContent = message;
    GameEndScreen.classList.add("show");    
}
