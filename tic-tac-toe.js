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
  return Object.assign({}, prototype);
};

const SmartAIPlayer = (name, token) => {
  const prototype = Player(name, token);
  return Object.assign({}, prototype);
};

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
      } else {
        button.classList.remove(`selected`);
      }
    });
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

    // Create the players and initialise the game
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
        player2 = SmartAIPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
        break;
      default:
        player2 = HumanPlayer(player2Name, _PLAYER_2_DEFAULT_TOKEN);
    }

    // TODO: initialise the game

    // Update the display
    displayController.render();
  };

  const _onRestart = (event) => {
    // TODO

    // Update the display
    displayController.render();
  };

  const _onNew = (event) => {
    // TODO

    // Update the display
    displayController.render();
  };

  const _onBoardButton = (event) => {
    // TODO 
  }

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
