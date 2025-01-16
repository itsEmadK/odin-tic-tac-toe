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

const gameController = (function (gameBoard) {

    let turn = 1;

    function getGameResult() {
        //Check rows:
        for (let i = 0; i < 3; i++) {
            if (
                gameBoard.getCell(i, 0) ===
                gameBoard.getCell(i, 1) ===
                gameBoard.getCell(i, 2)
            ) {
                return gameBoard[getCell(i, 0)];
            }

        }

        //Check columns:
        for (let j = 0; j < 3; j++) {
            if (
                gameBoard.getCell(0, j) ===
                gameBoard.getCell(1, j) ===
                gameBoard.getCell(2, j)
            ) {
                return gameBoard.getCell(0, j);
            }

        }

        //Check main diagonal:
        if (
            gameBoard.getCell(0, 0) ===
            gameBoard.getCell(1, 1) ===
            gameBoard.getCell(2, 2)
        ) {
            return gameBoard.getCell(0, 0);
        }


        //Check secondary diagonal:
        if (
            gameBoard.getCell(2, 0) ===
            gameBoard.getCell(1, 1) ===
            gameBoard.getCell(0, 2)
        ) {
            return gameBoard.getCell(0, 0);
        }


        //Check for tie:
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.getCell(i, j) === null) {
                    return null; //Game is not finished yet.
                }
            }
        }


        return 0; //It's a tie.


    }

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

    return {
        getGameResult,
        playTurn
    };

})(gameBoard);


function createPlayer(name, marker, id) {
    function getName() {
        return name;
    }

    function setName(newName) {
        name = newName;
    }

    function getMarker() {
        return marker;
    }

    function playTurn(i, j) {
        gameController.playTurn(i, j, id);
    }

    return {
        getName,
        setName,
        getMarker,
        playTurn,
    }

}