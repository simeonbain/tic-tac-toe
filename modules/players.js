import { GameBoard } from "./game-board.js";
import { game } from "./game.js";

/* -- Player class -- */
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

/* -- Human Player Class */
const HumanPlayer = (name, token) => {
  // Inherit from Player class
  const prototype = Player(name, token);

  let _move = null;

  const setUserMove = (move) => {
    _move = move;
  };

  // Make the move that was previously set by the user
  const makeMove = () => {
    game.getGameBoard().setBoardSquare(_move, token);
  };

  return Object.assign({}, prototype, { setUserMove, makeMove });
};

/* Random AI Player Class */
const RandomAIPlayer = (name, token) => {
  // Inherit from Player class
  const prototype = Player(name, token);

  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Make a random move from the available valid moves
  const makeMove = () => {
    const validMoves = game.getGameBoard().getEmptyBoardSquares();
    if (validMoves.length > 0) {
      game
        .getGameBoard()
        .setBoardSquare(
          validMoves[_getRandomIntInclusive(0, validMoves.length - 1)],
          token
        );
    }
  };

  return Object.assign({}, prototype, { makeMove });
};

/* Smart AI Player Class */
const SmartAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  /* Constants */
  const _SMART_AI_TURN = 0;
  const _OTHER_PLAYER_TURN = 1;

  const _OUTCOME_LOSE = -1;
  const _OUTCOME_DRAW = 0;
  const _OUTCOME_WIN = 1;

  /* Internal helper functions */
  const _nextChar = (c) => {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  };

  const _OTHER_PLAYER_TOKEN = _nextChar(token);

  // Makes a copy of then input gameBoard object and return it
  const _makeGameBoardCopy = (gameBoard) => {
    const gameBoardCopy = GameBoard();
    for (let row = 0; row < gameBoard.getSize(); row++) {
      for (let column = 0; column < gameBoard.getSize(); column++) {
        if (gameBoard.isEmptyBoardSquare([row, column])) {
          gameBoardCopy.setBoardSquare([row, column], ``);
        } else if (gameBoard.getBoardSquare([row, column]) === token) {
          gameBoardCopy.setBoardSquare([row, column], token);
        } else {
          gameBoardCopy.setBoardSquare([row, column], _OTHER_PLAYER_TOKEN);
        }
      }
    }

    return gameBoardCopy;
  };

  // Implements the recursive minimax algorithm
  const _minimax = (gameBoard, turn) => {
    // Check the base/exit conditions
    if (gameBoard.checkWin()) {
      if (turn === _OTHER_PLAYER_TURN) {
        return _OUTCOME_WIN;
      } else {
        return _OUTCOME_LOSE;
      }
    } else if (gameBoard.getEmptyBoardSquares().length === 0) {
      return _OUTCOME_DRAW;
    }

    if (turn === _SMART_AI_TURN) {
      // If it is the AI's turn, recursively maximise the outcome and return
      let bestOutcome = _OUTCOME_LOSE;
      const validMoves = gameBoard.getEmptyBoardSquares();

      validMoves.forEach((validMove) => {
        const gameBoardCopy = _makeGameBoardCopy(gameBoard);
        gameBoardCopy.setBoardSquare(validMove, token);

        const outcome = _minimax(gameBoardCopy, _OTHER_PLAYER_TURN);

        if (outcome > bestOutcome) {
          bestOutcome = outcome;
        }
      });

      return bestOutcome;
    } else {
      // If it is not the AI's turn, recursively minimise the outcome and return
      let bestOutcome = _OUTCOME_WIN;
      const validMoves = gameBoard.getEmptyBoardSquares();

      validMoves.forEach((validMove) => {
        const gameBoardCopy = _makeGameBoardCopy(gameBoard);
        gameBoardCopy.setBoardSquare(validMove, _OTHER_PLAYER_TOKEN);

        const outcome = _minimax(gameBoardCopy, _SMART_AI_TURN);

        if (outcome < bestOutcome) {
          bestOutcome = outcome;
        }
      });
      return bestOutcome;
    }
  };

  /* Methods */
  // Makes the optimal move from the available moves using the minimax algorithm
  const makeMove = () => {
    let bestOutcome = _OUTCOME_LOSE;
    const validMoves = game.getGameBoard().getEmptyBoardSquares();
    if (validMoves.length === 0) {
      return;
    }
    let move = validMoves[0];

    // Start the minimax algorithm by calling minimax on all the available moves
    validMoves.forEach((validMove) => {
      const gameBoardCopy = _makeGameBoardCopy(game.getGameBoard());
      gameBoardCopy.setBoardSquare(validMove, token);

      const outcome = _minimax(gameBoardCopy, _OTHER_PLAYER_TURN);

      if (outcome > bestOutcome) {
        bestOutcome = outcome;
        move = validMove;
      }
    });

    // Make the move after the optimal move has been found
    game.getGameBoard().setBoardSquare(move, token);
  };

  return Object.assign({}, prototype, { makeMove });
};

export { Player, HumanPlayer, RandomAIPlayer, SmartAIPlayer };
