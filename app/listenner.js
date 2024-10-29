export class Listener {

    gap = 50;
    observers = [];

    startListener(canvas) {
        canvas.addEventListener('click', (event) => {
            let position = {
                x: Math.floor(event.offsetX/this.gap),
                y: Math.floor(event.offsetY/this.gap)
            };

            this.notifyAll(position);
        });
    }

    notifyAll(command) {
        console.log(`Listener.notifyAll() -> Notify observers: ${this.observers.length}`);

        for(const func of this.observers) {
            func(command);
        }
    }

    addObserver(observerFunction) {
        this.observers.push(observerFunction);
    }

    removeObserver(observerFunction) {

    }

}




const board = document.getElementById('board');
const ctx =  board.getContext('2d');
const cellSize = 1000;
const boardSize = 8000;
let selectedPiece = null;


//
// board.addEventListener("click", (e) => {
//     const col = Math.floor(e.offsetX / cellSize);
//     const row = Math.floor(e.offsetY / cellSize);
//     const piece = board[row][col];
//
//     if (selectedPiece) {
//         const [selectedRow, selectedCol] = selectedPiece;
//         if (isValidMove(selectedPiece.x, selectedPiece.y, row, col)) {
//             board[row][col] = board[selectedRow][selectedCol];
//             board[selectedRow][selectedCol] = null;
//             turnRed = !turnRed;
//         }
//         selectedPiece = null;
//     } else if (piece && ((turnRed && piece === "red") || (!turnRed && piece === "black"))) {
//         selectedPiece = [row, col];
//     }
//     drawBoard();
// });
//
// function isValidMove(row1, col1, row2, col2) {
//     if (board[row2][col2] !== null || (row1 === row2 && col1 === col2)) return false;
//     const piece = board[row1][col1];
//     const rowDiff = row2 - row1;
//     const colDiff = Math.abs(col2 - col1);
//
//     if (piece === "red" && rowDiff === -1 && colDiff === 1) return true;
//     if (piece === "black" && rowDiff === 1 && colDiff === 1) return true;
//
//     // Movimento de captura
//     if (piece === "red" && rowDiff === -2 && colDiff === 2) {
//         const midRow = (row1 + row2) / 2;
//         const midCol = (col1 + col2) / 2;
//         if (board[midRow][midCol] === "black") {
//             board[midRow][midCol] = null;
//             return true;
//         }
//     } else if (piece === "black" && rowDiff === 2 && colDiff === 2) {
//         const midRow = (row1 + row2) / 2;
//         const midCol = (col1 + col2) / 2;
//         if (board[midRow][midCol] === "red") {
//             board[midRow][midCol] = null;
//             return true;
//         }
//     }
//     return false;
// }