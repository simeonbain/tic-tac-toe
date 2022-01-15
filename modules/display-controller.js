import { game } from "./game.js";
import { gameState } from "./game-state.js";
import { objectSelector } from "./object-selector.js";

/* -- Display Controller -- */
const displayController = (() => {
  /* Variables */
  let _player2TypeSelection = `human`;

  /* Internal helper functions */
  const setPlayer2TypeSelection = (selectedType) => {
    _player2TypeSelection = selectedType;
  };

  /* Methods */
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
      objectSelector.startScreen.classList.remove(`inactive`);
      objectSelector.gameScreen.classList.add(`inactive`);
    } else {
      objectSelector.status.classList.remove(`hidden`);
      objectSelector.restartButton.classList.remove(`hidden`);
      objectSelector.startScreen.classList.add(`inactive`);
      objectSelector.gameScreen.classList.remove(`inactive`);

      // Update the board on game screen
      objectSelector.boardButtons.forEach((boardButton) => {
        // Make each button hoverable
        boardButton.classList.add(`hoverable`);

        // Get the value of each button based on the internal gameBoard
        const value = game
          .getGameBoard()
          .getBoardSquare([
            +boardButton.dataset.row,
            +boardButton.dataset.column,
          ]);

        // Update the DOM
        if (value === ``) {
          boardButton.innerText = ``;
          boardButton.classList.remove(`active`);
          boardButton.classList.remove(`win`);
        } else {
          boardButton.innerText = value;
          boardButton.classList.add(`active`);
        }
      });

      const playerName = game.getCurrentPlayer().getName();
      if (game.getState() === gameState.IN_PROGRESS) {
        // Update the status with next move prompt based on current player
        if (playerName.toLowerCase()[playerName.length - 1] === `s`) {
          objectSelector.status.firstElementChild.innerText = `${playerName}'`;
        } else {
          objectSelector.status.firstElementChild.innerText = `${playerName}'s`;
        }
        objectSelector.status.lastElementChild.innerText = ` Move`;
      } else if (game.getState() === gameState.WIN) {
        // Update the status with the winning player
        objectSelector.status.firstElementChild.innerText = `${playerName}`;
        objectSelector.status.lastElementChild.innerText = ` Wins! 🏆`;

        objectSelector.boardButtons.forEach((boardButton) => {
          // Game is over so make each button unhoverable
          boardButton.classList.remove(`hoverable`);

          // Highlight the winning squares on the board
          if (
            game
              .getGameBoard()
              .isWinningBoardSquare([
                +boardButton.dataset.row,
                +boardButton.dataset.column,
              ])
          ) {
            boardButton.classList.add(`win`);
          } else {
            boardButton.classList.remove(`win`);
          }
        });
      } else if (game.getState() === gameState.DRAW) {
        objectSelector.boardButtons.forEach((boardButton) => {
          // Game is over so make each button unhoverable
          boardButton.classList.remove(`hoverable`);
        });

        // Update the status with the draw result
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
