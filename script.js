const gameBoard = (function () {
    let board;
    initBoard();

    function initBoard() {
        board = [];
        for (let i = 0; i < 3; i++) {
            const temp = [];
            for (let j = 0; j < 3; j++) {
                temp.push(null);
            }
            board.push(temp);
        }
    }
    function clearBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    }

    //Return false if cell is occupied.
    function setCell(i, j, player) {
        if (board[i][j] !== null) {
            board[i][j] = player;
            return true;
        } else {
            return false; //Cell is occupied.
        }
    }

    function getCell(i, j) {
        return board[i][j];
    }
    return {
        clearBoard,
        setCell,
        getCell,
    };
})()

const gameController = (function () {

    let turn = 1;

    function playTurn(i, j, player) {
        if (turn !== player) {
            return false;
        } else {
            const isMoveValid = gameBoard.setCell(i, j, player);
            if (isMoveValid) {
                turn = (turn === 1) ? 2 : 1;
            }
            return isMoveValid;
        }
    }


})();