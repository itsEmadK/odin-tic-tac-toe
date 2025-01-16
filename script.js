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
    return {
        clearBoard,
    };
})()