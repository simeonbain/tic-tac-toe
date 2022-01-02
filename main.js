import { HumanPlayer, RandomAIPlayer, SmartAIPlayer } from "./modules/players.js";
import { gameBoard } from "./modules/game-board.js";
import { game } from "./modules/game.js";
import { gameState } from "./modules/game-state.js";
import { objectSelector } from "./modules/object-selector.js";
import { displayController } from "./modules/display-controller.js";


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