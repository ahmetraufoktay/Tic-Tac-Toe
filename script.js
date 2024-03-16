function Gameboard() {
    const columns = 3;
    const rows = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const changeMark = (row,column,player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addMark(player);
        }
    };

    const returnBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        return boardWithCellValues;
    };
    return { changeMark, returnBoard }
}

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };
    
    const getValue = () => value;

    return {addMark,getValue}
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token:'X'
        }, 
        {
            name:playerTwoName,
            token:'O'
        }
    ];
    
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(board.returnBoard());
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row,column) => {
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}...`
          );
        board.changeMark(row,column,getActivePlayer().token);
        
        const boardWithCellValues = board.returnBoard();

        if (checkForWin(boardWithCellValues, activePlayer)) {
            console.log(`${activePlayer.name}(${activePlayer.token}) WON`);
            turnSign.innerHTML = `${activePlayer.name} (${activePlayer.token}) WON`
            container.removeEventListener('click', handleCellClick);
        } else if (!checkForEmptySpaces(boardWithCellValues)) {
            console.log("It's a draw! No more empty spaces.");
            turnSign.innerHTML = "It's a draw! No more empty spaces.";
            container.removeEventListener('click', handleCellClick);
        }

        printNewRound();
        switchPlayerTurn();
    };

    function checkForWin(board,player) {
        const checkLine = (line) => line.every(([row, col]) => board[row][col] === player.token);

        for (let i = 0; i < 3; i++) {
            if (checkLine([[i, 0], [i, 1], [i, 2]])) return true;
        }
        for (let j=0; j < 3; j++) {
            if (checkLine([[0,j], [1,j], [2,j]])) return true;
        }
        if (checkLine([[0,0], [1,1], [2,2]])) return true;
        else if (checkLine([[2,0], [1,1], [0,2]])) return true;
        
        return false;
    }

    function checkForEmptySpaces(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    return true; 
                }
            }
        }
        return false;
    }

    printNewRound();

    return { playRound, getActivePlayer };
}

const game = GameController();

const container = document.querySelector(".container");
const turnSign = document.querySelector('.turn');

const handleCellClick = (event) => {
    const cell = event.target;
    const row = cell.getAttribute('row');
    const column = cell.getAttribute('column');

    if (cell.innerHTML !== '') {
        return;
    }
    
    cell.innerHTML = game.getActivePlayer().token;
    turnSign.innerHTML = `${game.getActivePlayer().name} (${game.getActivePlayer().token})'s turn`;
    game.playRound(row, column);
};

container.addEventListener('click', handleCellClick);

