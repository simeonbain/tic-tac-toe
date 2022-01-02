import { gameBoard } from "./game-board.js";
import { game } from "./game.js";
import { gameState } from "./game-state.js";
import { objectSelector } from "./object-selector.js";

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
        objectSelector.status.firstElementChild.innerText = `${game
          .getCurrentPlayer()
          .getName()}`;
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

export { displayController };
