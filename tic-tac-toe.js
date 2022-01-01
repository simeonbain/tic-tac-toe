/* -- Players -- */
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return {
    getName,
    getToken,
  };
};

const HumanPlayer = (name, token) => {
  const prototype = Player(name, token);
  return Object.assign({}, prototype);
};

const RandomAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Returns a random valid move in the format [moveRow, moveColumn]
  const getMove = () => {
    const validMoves = gameBoard.getEmptyBoardSquares();
    if (validMoves.length > 0) {
      return validMoves[_getRandomIntInclusive(0, validMoves.length - 1)];
    }
  };

  return Object.assign({}, prototype, { getMove });
};

const SmartAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  // Returns the optimal valid move in the format [moveRow, moveColumn]
  const getMove = () => {};
  return Object.assign({}, prototype, { getMove });
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

  const setBoardSquare = ([row, column], value) => {
    if (_board[row][column] === ``) {
      _board[row][column] = value;
    }
  };

  const getBoardSquare = ([row, column]) => {
    return _board[row][column];
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

  // Internal functions
  const _getRandomPlayer = () => {
    if (Math.round(Math.random()) === 0) {
      return _player1;
    } else {
      return _player2;
    }
  };

  const _toggleCurrentPlayer = () => {
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

  const makeUserMove = ([moveRow, moveColumn]) => {
    if (_currentPlayer && _currentPlayer.getMove === undefined) {
      // Only accept the user move if the current player cannot generate it's own
      gameBoard.setBoardSquare(
        [moveRow, moveColumn],
        _currentPlayer.getToken()
      );
      _toggleCurrentPlayer();
    }
  };

  const restart = () => {
    gameBoard.resetBoard(); 
    _currentPlayer = _getRandomPlayer();
    _state = gameState.IN_PROGRESS; 
  }

  const reset = () => {
    gameBoard.resetBoard(); 
    _player1 = null; 
    _player2 = null; 
    _currentPlayer = null; 
    _state = gameState.INITIAL; 
  }

  return {
    getCurrentPlayer,
    getState,
    initialise,
    makeUserMove,
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

      // Update the next move prompt based on current player
      objectSelector.status.firstElementChild.innerText = `${game
        .getCurrentPlayer()
        .getName()}'s`;

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

  // Event handlers
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
        // TODO: swap to RandomAIPlayer
        player2 = HumanPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
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

    // Update the display
    displayController.render();
  };

  const _onRestart = (event) => {
    game.restart(); 

    // Update the display
    displayController.render();
  };

  const _onNew = (event) => {
    game.reset(); 

    // Update the display
    displayController.render();
  };

  const _onBoardButton = (event) => {
    game.makeUserMove([event.target.dataset.row, event.target.dataset.column]);

    // Update the display
    displayController.render();
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
