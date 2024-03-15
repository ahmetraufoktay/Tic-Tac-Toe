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
            console.log('positive');
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
        return boardWithCellValues;
    };
    return { changeMark, printBoard }
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
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row,column) => {
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}...`
          );
        board.changeMark(row,column,getActivePlayer().token);
        
        const boardWithCellValues = board.printBoard();

        if (checkForWin(boardWithCellValues, players[0])) {
            console.log('Player One (X) WON');
        } else if(checkForWin(boardWithCellValues, players[1])) {
            console.log('Player Two(O) WON')
        } else if (!checkForEmptySpaces(boardWithCellValues)) {
            console.log("It's a draw! No more empty spaces.");
        }
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

