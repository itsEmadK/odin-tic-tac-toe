const player1 = createPlayer("Emad", "x", 1);
const player2 = createPlayer("Sag", "o", 2);

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
        if (board[i][j] === null) {
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
        board, //Just exposing it for test.
    };
})()

const gameController = (function (gameBoard) {

    let turn = 1;


    function getWinningSequence() {
        const winningSequence = [];
        //Check rows:
        for (let i = 0; i < 3; i++) {
            if (
                gameBoard.getCell(i, 0) === gameBoard.getCell(i, 1) &&
                gameBoard.getCell(i, 1) === gameBoard.getCell(i, 2) &&
                gameBoard.getCell(i, 2) !== null
            ) {
                winningSequence.push({ i: i, j: 0 });
                winningSequence.push({ i: i, j: 1 });
                winningSequence.push({ i: i, j: 2 });
                return winningSequence;
            }

        }

        //Check columns:
        for (let j = 0; j < 3; j++) {
            if (
                gameBoard.getCell(0, j) === gameBoard.getCell(1, j) &&
                gameBoard.getCell(1, j) === gameBoard.getCell(2, j) &&
                gameBoard.getCell(2, j) !== null
            ) {
                winningSequence.push({ i: 0, j: j });
                winningSequence.push({ i: 1, j: j });
                winningSequence.push({ i: 2, j: j });
                return winningSequence;
            }

        }

        //Check main diagonal:
        if (
            gameBoard.getCell(0, 0) === gameBoard.getCell(1, 1) &&
            gameBoard.getCell(1, 1) === gameBoard.getCell(2, 2) &&
            gameBoard.getCell(2, 2) !== null
        ) {
            winningSequence.push({ i: 0, j: 0 });
            winningSequence.push({ i: 1, j: 1 });
            winningSequence.push({ i: 2, j: 2 });
            return winningSequence;
        }


        //Check secondary diagonal:
        if (
            gameBoard.getCell(2, 0) === gameBoard.getCell(1, 1) &&
            gameBoard.getCell(1, 1) === gameBoard.getCell(0, 2) &&
            gameBoard.getCell(0, 2) !== null
        ) {
            winningSequence.push({ i: 2, j: 0 });
            winningSequence.push({ i: 1, j: 1 });
            winningSequence.push({ i: 0, j: 2 });
            return winningSequence;
        }


        //Check for tie:
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.getCell(i, j) === null) {
                    return null; //Game is not finished yet.
                }
            }
        }


        return []; //It's a tie.


    }


    function getGameResult() {
        const winningSequence = getWinningSequence();
        if (winningSequence === null) {
            return null; //Game not over yet;
        } else if (winningSequence.length === 0) {
            return 0; //Tie;
        } else {
            const winner = gameBoard.getCell(winningSequence[0].i, winningSequence[0].j);
            return winner;
        }
    }

    function playTurn(i, j, player) {
        const isMoveValid = gameBoard.setCell(i, j, player);
        if (isMoveValid) {
            turn = (turn === 1) ? 2 : 1;
        }
        return isMoveValid;
    }

    function getTurn() {
        return turn;
    }

    function reset() {
        gameBoard.clearBoard();
        turn = 1;
    }

    return {
        getGameResult,
        playTurn,
        getTurn,
        getWinningSequence,
        reset,
    };

})(gameBoard);

const DOMController = (function (gameController, gameBoard, player1, player2) {

    const cellsGridDiv = document.querySelector("div.cells-grid");
    let isGameFinished = false;


    addHoverListenerToCells();
    addClickListenerToCells();
    updateCellsGrid();

    function updateCellsGrid() {
        cellsGridDiv.innerHTML = "";
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        const gameResult = gameController.getGameResult();
        let winningSequence = [];
        if (gameResult === 1 || gameResult === 2) {
            winningSequence = gameController.getWinningSequence();
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const tempCell = cellDiv.cloneNode(true);
                tempCell.dataset.i = i;
                tempCell.dataset.j = j;
                if (gameBoard.getCell(i, j) === 1) {
                    tempCell.classList.add("occupied")
                    tempCell.innerText = player1.getMarker();
                } else if (gameBoard.getCell(i, j) === 2) {
                    tempCell.classList.add("occupied")
                    tempCell.innerText = player2.getMarker();
                }


                winningSequence.forEach((cell) => {
                    if (cell.i === +tempCell.dataset.i && cell.j === +tempCell.dataset.j) {
                        tempCell.classList.add("winner");
                    }
                });


                cellsGridDiv.appendChild(tempCell);
            }
        }
    }

    function addHoverListenerToCells() {
        cellsGridDiv.addEventListener("mouseover", (e) => {
            if (!isGameFinished) {
                if ([...e.target.classList].includes("cell")) {
                    const cellDiv = e.target;
                    const turn = gameController.getTurn();
                    if (![...cellDiv.classList].includes("occupied")) {
                        cellDiv.innerText = turn === 1 ? player1.getMarker() : player2.getMarker();
                    }
                }
            }
        });

        cellsGridDiv.addEventListener("mouseout", (e) => {
            if (!isGameFinished) {
                if ([...e.target.classList].includes("cell")) {
                    const cellDiv = e.target;
                    if (![...cellDiv.classList].includes("occupied")) {
                        cellDiv.innerText = "";
                    }
                }
            }
        });
    }

    function addClickListenerToCells() {
        cellsGridDiv.addEventListener("click", (e) => {
            if (!isGameFinished) {
                if ([...e.target.classList].includes("cell")) {
                    const cellDiv = e.target;
                    const [i, j] = [cellDiv.dataset.i, cellDiv.dataset.j];
                    const turn = gameController.getTurn();
                    const player = turn === 1 ? player1 : player2;
                    const isCellAvailable = player.playTurn(i, j);
                    if (isCellAvailable) {
                        if (
                            gameController.getGameResult() === 0 ||
                            gameController.getGameResult() === 1 ||
                            gameController.getGameResult() === 2
                        ) {
                            isGameFinished = true;
                        }
                        updateCellsGrid();
                    }
                }
            }
        });
    }

    return {
        updateCellsGrid,
    };

})(gameController, gameBoard, player1, player2);


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
        return gameController.playTurn(i, j, id);
    }

    function getID() {
        return id;
    }

    return {
        getName,
        setName,
        getMarker,
        playTurn,
        getID,
    }

}


function showBoard() {
    console.table(gameBoard.board);
}