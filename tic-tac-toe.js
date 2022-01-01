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

  // Event handlers
  const _onPlayer2Button = (event) => {
    // TODO

    // Update the display
    displayController.render();
  };

  const _onStart = (event) => {
    // TODO

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

    // Update the display
    displayController.render();
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
