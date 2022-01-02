import { gameBoard } from "./game-board";

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

export { Player, HumanPlayer, RandomAIPlayer, SmartAIPlayer };
