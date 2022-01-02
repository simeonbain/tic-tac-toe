/* -- Players -- */
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  const makeMove = () => {};

  return {
    getName,
    getToken,
    makeMove,
  };
};

const HumanPlayer = (name, token) => {
  const prototype = Player(name, token);

  let _move = null;

  const setUserMove = ([moveRow, moveColumn]) => {
    _move = [moveRow, moveColumn];
  };

  const makeMove = () => {
    gameBoard.setBoardSquare(_move, token);
  };

  return Object.assign({}, prototype, { setUserMove, makeMove });
};

const RandomAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const makeMove = () => {
    const validMoves = gameBoard.getEmptyBoardSquares();
    if (validMoves.length > 0) {
      gameBoard.setBoardSquare(
        validMoves[_getRandomIntInclusive(0, validMoves.length - 1)],
        token
      );
    }
  };

  return Object.assign({}, prototype, { makeMove });
};

const SmartAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  return Object.assign({}, prototype, {});
};

/* -- State -- */
const gameState = (() => {
  // State constants
  const INITIAL = 0;
  const IN_PROGRESS = 1;
  const WIN = 2;
  const DRAW = 3;

  return {
    INITIAL,
    IN_PROGRESS,
    WIN,
    DRAW,
  };
})();

/* -- Game Board -- */
const gameBoard = (() => {
  const _board = [
    [``, ``, ``],
    [``, ``, ``],
    [``, ``, ``],
  ];

  const _isWinInRow = (rowIndex) => {
    for (let columnIndex = 0; columnIndex < _board.length - 1; columnIndex++) {
      if (
        _board[rowIndex][columnIndex] === `` ||
        _board[rowIndex][columnIndex] !== _board[rowIndex][columnIndex + 1]
      ) {
        return false;
      }
    }
    return true;
  };

  const _isWinInColumn = (columnIndex) => {
    for (let rowIndex = 0; rowIndex < _board.length - 1; rowIndex++) {
      if (
        _board[rowIndex][columnIndex] === `` ||
        _board[rowIndex][columnIndex] !== _board[rowIndex + 1][columnIndex]
      ) {
        return false;
      }
    }
    return true;
  };

  const _isWinInLeftDiagonal = () => {
    let count = 1;
    for (let i = 0; i < _board.length - 1; i++) {
      if (_board[i][i] !== `` && _board[i][i] === _board[i + 1][i + 1]) {
        count++;
      }
    }

    return count === _board.length ? true : false; 
  };

  const _isWinInRightDiagonal = () => {
    let count = 1; 
		for (let i = 0, j = _board.length-1; i < _board.length-1; i++, j--) {

			if (_board[i][j] !== `` && _board[i][j] === _board[i+1][j-1]) {
				count++; 
			}
		}

		return count === _board.length ? true : false; 
  };

  const setBoardSquare = ([rowIndex, columnIndex], value) => {
    if (_board[rowIndex][columnIndex] === ``) {
      _board[rowIndex][columnIndex] = value;
    }
  };

  const getBoardSquare = ([rowIndex, columnIndex]) => {
    return _board[rowIndex][columnIndex];
  };

  const getEmptyBoardSquares = () => {
    const emptyBoardSquares = [];

    _board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (_board[rowIndex][columnIndex] === ``) {
          emptyBoardSquares.push([rowIndex, columnIndex]);
        }
      });
    });

    return emptyBoardSquares;
  };

  const isBoardSquareEmpty = ([rowIndex, columnIndex]) => {
    return _board[rowIndex][columnIndex] === `` ? true : false;
  };

  const checkWin = () => {
    // Check each row for win
    for (let rowIndex = 0; rowIndex < _board.length; rowIndex++) {
      if (_isWinInRow(rowIndex)) {
        return true;
      }
    }

    // Check each column for win
    for (let columnIndex = 0; columnIndex < _board.length; columnIndex++) {
      if (_isWinInColumn(columnIndex)) {
        return true;
      }
    }

    // Check diagonals for win
    if (_isWinInLeftDiagonal() || _isWinInRightDiagonal()) {
      return true;
    }

    // All rows, columns and diagonals have been checked, there is no win
    return false;
  };

  const resetBoard = () => {
    _board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        _board[rowIndex][columnIndex] = ``;
      });
    });
  };

  return {
    setBoardSquare,
    getBoardSquare,
    getEmptyBoardSquares,
    isBoardSquareEmpty,
    checkWin,
    resetBoard,
  };
})();

/* -- Game -- */
const game = (() => {
  // Variables
  let _player1 = null;
  let _player2 = null;
  let _currentPlayer = null;
  let _state = gameState.INITIAL;

  // Internal helper functions
  const _getRandomPlayer = () => {
    if (Math.round(Math.random()) === 0) {
      return _player1;
    } else {
      return _player2;
    }
  };

  const _switchCurrentPlayer = () => {
    _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1;
  };

  // Getters/Setters
  const getCurrentPlayer = () => {
    return _currentPlayer;
  };

  const getState = () => {
    return _state;
  };

  // Methods
  const initialise = (player1, player2) => {
    _player1 = player1;
    _player2 = player2;
    gameBoard.resetBoard();
    _currentPlayer = _getRandomPlayer();
    _state = gameState.IN_PROGRESS;
  };

  const update = () => {
    if (gameBoard.checkWin() === true) {
      // Game over, current player wins
      _state = gameState.WIN;
    } else if (gameBoard.getEmptyBoardSquares().length === 0) {
      // Game over, it's a draw
      _state = gameState.DRAW;
    } else {
      // Game still running, switch the current player for the next turn
      _switchCurrentPlayer();
    }
  };

  const restart = () => {
    gameBoard.resetBoard();
    _currentPlayer = _getRandomPlayer();
    _state = gameState.IN_PROGRESS;
  };

  const reset = () => {
    gameBoard.resetBoard();
    _player1 = null;
    _player2 = null;
    _currentPlayer = null;
    _state = gameState.INITIAL;
  };

  return {
    getCurrentPlayer,
    getState,
    initialise,
    //makeUserMove,
    update,
    restart,
    reset,
  };
})();

/* -- DOM Object Selector -- */
const objectSelector = (() => {
  const player1Name = document.querySelector(`input[name="player1-name"]`);
  const player2Name = document.querySelector(`input[name="player2-name"]`);
  const player2Buttons = document.querySelectorAll(`.player2-buttons button`);
  const startButton = document.querySelector(`.start`);
  const restartButton = document.querySelector(`.restart`);
  const newButton = document.querySelector(`.new`);
  const boardButtons = document.querySelectorAll(`.btn-board`);
  const status = document.querySelector(`.status`);

  return {
    player1Name,
    player2Name,
    player2Buttons,
    startButton,
    restartButton,
    newButton,
    boardButtons,
    status,
  };
})();

/* -- Display Controller -- */
const displayController = (() => {
  let _player2TypeSelection = `human`;

  const setPlayer2TypeSelection = (selectedType) => {
    _player2TypeSelection = selectedType;
  };

  const render = () => {
    // Update Player 2 type selection on start screen
    objectSelector.player2Buttons.forEach((button) => {
      if (button.dataset.type === _player2TypeSelection) {
        button.classList.add(`selected`);
        if (button.dataset.type === `human`) {
          objectSelector.player2Name.classList.remove(`hidden`);
        } else {
          objectSelector.player2Name.value = ``;
          objectSelector.player2Name.classList.add(`hidden`);
        }
      } else {
        button.classList.remove(`selected`);
      }
    });

    if (game.getState() === gameState.INITIAL) {
      objectSelector.status.classList.add(`hidden`);
      objectSelector.restartButton.classList.add(`hidden`);
    } else {
      objectSelector.status.classList.remove(`hidden`);
      objectSelector.restartButton.classList.remove(`hidden`);

      // Update the board on game screen
      objectSelector.boardButtons.forEach((boardButton) => {
        // Get the value of each button based on the internal gameBoard
        const value = gameBoard.getBoardSquare([
          +boardButton.dataset.row,
          +boardButton.dataset.column,
        ]);

        // Update the DOM
        if (value === ``) {
          boardButton.innerText = ``;
          boardButton.classList.remove(`active`);
        } else {
          boardButton.innerText = value;
          boardButton.classList.add(`active`);
        }
      });

      if (game.getState() === gameState.IN_PROGRESS) {
        // Update the next move prompt based on current player
        objectSelector.status.firstElementChild.innerText = `${game
        .getCurrentPlayer()
        .getName()}'s`;
        objectSelector.status.lastElementChild.innerText = ` Move`;
      } else if (game.getState() === gameState.WIN) {
        objectSelector.status.firstElementChild.innerText = `${game.getCurrentPlayer().getName()}`;
        objectSelector.status.lastElementChild.innerText = ` Wins! 🏆`;
      } else if (game.getState() === gameState.DRAW) {
        objectSelector.status.firstElementChild.innerText = ``;
        objectSelector.status.lastElementChild.innerText = `It's a draw 🤝`;
      }
    }
  };

  return {
    setPlayer2TypeSelection,
    render,
  };
})();

/* -- Main Controller -- */
const ticTacToeApp = (() => {
  // Constants
  const _PLAYER_1_DEFAULT_NAME = `Player X`;
  const _PLAYER_1_DEFAULT_TOKEN = `X`;
  const _PLAYER_2_DEFAULT_NAME = `Player O`;
  const _PLAYER_2_DEFAULT_TOKEN = `O`;
  const _PLAYER_TYPE_HUMAN = 0;
  const _PLAYER_TYPE_RANDOM_AI = 1;
  const _PLAYER_TYPE_SMART_AI = 2;

  // Variables
  let _player2TypeSelection = _PLAYER_TYPE_HUMAN;

  // Internal helper functions
  const _makeMoveIfAI = (player) => {
    // A move can't be made if the game is not currently running
    if (game.getState() !== gameState.IN_PROGRESS) {
      return;
    }

    if (player.setUserMove === undefined) {
      // Player is an AI player so make the move and update the game/display
      player.makeMove();
      game.update();
      displayController.render();
    }
  };

  // Internal event handlers
  const _onPlayer2Button = (event) => {
    switch (event.target.dataset.type) {
      case `human`:
        _player2TypeSelection = _PLAYER_TYPE_HUMAN;
        break;
      case `random-ai`:
        _player2TypeSelection = _PLAYER_TYPE_RANDOM_AI;
        break;
      case `smart-ai`:
        _player2TypeSelection = _PLAYER_TYPE_SMART_AI;
        break;
    }

    // Update the display
    displayController.setPlayer2TypeSelection(event.target.dataset.type);
    displayController.render();
  };

  const _onStart = (event) => {
    // Parse input from user
    // Player 1
    const player1Name =
      objectSelector.player1Name.value === ``
        ? _PLAYER_1_DEFAULT_NAME
        : objectSelector.player1Name.value;

    // Player 2
    const player2Name =
      objectSelector.player2Name.value === ``
        ? _PLAYER_2_DEFAULT_NAME
        : objectSelector.player2Name.value;

    // Create the players
    const player1 = HumanPlayer(player1Name, _PLAYER_1_DEFAULT_TOKEN);

    let player2 = null;
    switch (_player2TypeSelection) {
      case _PLAYER_TYPE_HUMAN:
        player2 = HumanPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
        break;
      case _PLAYER_TYPE_RANDOM_AI:
        player2 = RandomAIPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
        break;
      case _PLAYER_TYPE_SMART_AI:
        // TODO: swap to SmartAIPlayer
        player2 = HumanPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
        break;
      default:
        player2 = HumanPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
    }

    // Initialise the game
    game.initialise(player1, player2);

    // Trigger an AI move in case the new current player is AI
    _makeMoveIfAI(game.getCurrentPlayer());

    // Update the display
    displayController.render();
  };

  const _onRestart = (event) => {
    game.restart();

    // Trigger an AI move in case the current player is AI
    _makeMoveIfAI(game.getCurrentPlayer());

    // Update the display
    displayController.render();
  };

  const _onNew = (event) => {
    game.reset();

    // Update the display
    displayController.render();
  };

  const _onBoardButton = (event) => {
    // If the game isn't running,
    // or the button selected was one that is already filled, we can ignore it
    if (
      game.getState() !== gameState.IN_PROGRESS ||
      !gameBoard.isBoardSquareEmpty([
        event.target.dataset.row,
        event.target.dataset.column,
      ])
    ) {
      return;
    }

    // Process the selected button only if the current player is not an AI
    else if (game.getCurrentPlayer().setUserMove !== undefined) {
      // Set the move to the selected button
      game
        .getCurrentPlayer()
        .setUserMove([event.target.dataset.row, event.target.dataset.column]);

      // Execute the move
      game.getCurrentPlayer().makeMove();

      // Update the game after the move (including switching the current player)
      game.update();

      // Update the display
      displayController.render();

      // Trigger an AI move in case the new current player is AI
      _makeMoveIfAI(game.getCurrentPlayer());
    }
  };

  // Event listeners
  objectSelector.player2Buttons.forEach((button) => {
    button.addEventListener(`click`, _onPlayer2Button);
  });
  objectSelector.startButton.addEventListener(`click`, _onStart);
  objectSelector.restartButton.addEventListener(`click`, _onRestart);
  objectSelector.newButton.addEventListener(`click`, _onNew);
  objectSelector.boardButtons.forEach((button) => {
    button.addEventListener(`click`, _onBoardButton);
  });
})();
