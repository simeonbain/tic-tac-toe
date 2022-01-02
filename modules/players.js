import { GameBoard } from "./game-board.js";
import { game } from "./game.js";

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
    game.getGameBoard().setBoardSquare(_move, token);
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

const SmartAIPlayer = (name, token) => {
  const prototype = Player(name, token);

  const _SMART_AI_TURN = 0;
  const _OTHER_PLAYER_TURN = 1;

  const _OUTCOME_LOSE = -1;
  const _OUTCOME_DRAW = 0;
  const _OUTCOME_WIN = 1;

  const _nextChar = (c) => {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  };

  const _OTHER_PLAYER_TOKEN = _nextChar(token);

  const _makeGameBoardCopy = (gameBoard) => {
    const gameBoardCopy = GameBoard();
    for (let row = 0; row < gameBoard.getSize(); row++) {
      for (let column = 0; column < gameBoard.getSize(); column++) {
        if (gameBoard.isBoardSquareEmpty([row, column])) {
          gameBoardCopy.setBoardSquare([row, column], ``);
        } else if (
          gameBoard.getBoardSquare([row, column]) === token
        ) {
          gameBoardCopy.setBoardSquare([row, column], token);
        } else {
          gameBoardCopy.setBoardSquare([row, column], _OTHER_PLAYER_TOKEN);
        }
      }
    }

    return gameBoardCopy;
  };

  const _minimax = (gameBoard, turn) => {
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

  const makeMove = () => {
    let bestOutcome = _OUTCOME_LOSE; 
    const validMoves = game.getGameBoard().getEmptyBoardSquares();
    if (validMoves.length === 0) {
      return;
    }
    let move = validMoves[0]; 

    validMoves.forEach((validMove) => {
      const gameBoardCopy = _makeGameBoardCopy(game.getGameBoard()); 
      gameBoardCopy.setBoardSquare(validMove, token); 
      const outcome = _minimax(gameBoardCopy, _OTHER_PLAYER_TURN);
      if (outcome > bestOutcome) {
        bestOutcome = outcome; 
        move = validMove;
      }
    });

    game.getGameBoard().setBoardSquare(move, token);
  };

  return Object.assign({}, prototype, { makeMove });
};

export { Player, HumanPlayer, RandomAIPlayer, SmartAIPlayer };
