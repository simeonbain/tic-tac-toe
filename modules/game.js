import { gameBoard } from "./game-board.js";
import { gameState } from "./game-state.js";

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
    update,
    restart,
    reset,
  };
})();

export { game };
