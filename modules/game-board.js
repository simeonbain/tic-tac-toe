/* -- Game Board Class -- */
const GameBoard = () => {
  /* Variables */
  const _board = [
    [``, ``, ``],
    [``, ``, ``],
    [``, ``, ``],
  ];

  const _winBoard = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];

  /* Internal helper functions */
  const _isWinInRow = (rowIndex) => {
    for (let columnIndex = 0; columnIndex < _board.length - 1; columnIndex++) {
      if (
        _board[rowIndex][columnIndex] === `` ||
        _board[rowIndex][columnIndex] !== _board[rowIndex][columnIndex + 1]
      ) {
        return false;
      }
    }

    for (let columnIndex = 0; columnIndex < _board.length; columnIndex++) {
      _winBoard[rowIndex][columnIndex] = true;
    }

    return true;
  };

  const _isWinInColumn = (columnIndex) => {
    for (let rowIndex = 0; rowIndex < _board.length - 1; rowIndex++) {
      if (
        _board[rowIndex][columnIndex] === `` ||
        _board[rowIndex][columnIndex] !== _board[rowIndex + 1][columnIndex]
      ) {
        return false;
      }
    }

    for (let rowIndex = 0; rowIndex < _board.length; rowIndex++) {
      _winBoard[rowIndex][columnIndex] = true;
    }

    return true;
  };

  const _isWinInLeftDiagonal = () => {
    let count = 1;
    for (let i = 0; i < _board.length - 1; i++) {
      if (_board[i][i] !== `` && _board[i][i] === _board[i + 1][i + 1]) {
        count++;
      }
    }

    if (count === _board.length) {
      for (let i = 0; i < _board.length; i++) {
        _winBoard[i][i] = true;
      }
      return true;
    } else {
      return false;
    }
  };

  const _isWinInRightDiagonal = () => {
    let count = 1;
    for (let i = 0, j = _board.length - 1; i < _board.length - 1; i++, j--) {
      if (_board[i][j] !== `` && _board[i][j] === _board[i + 1][j - 1]) {
        count++;
      }
    }

    if (count === _board.length) {
      for (let i = 0, j = _board.length-1; i < _board.length; i++, j--) {
        _winBoard[i][j] = true;
      }
      return true;
    } else {
      return false;
    }
  };

  /* Getters/Setters */
  const setBoardSquare = ([rowIndex, columnIndex], value) => {
    if (_board[rowIndex][columnIndex] === ``) {
      _board[rowIndex][columnIndex] = value;
    }
  };

  const getSize = () => {
    return _board.length;
  };

  const getBoardSquare = ([rowIndex, columnIndex]) => {
    return _board[rowIndex][columnIndex];
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

  /* Methods */
  const isEmptyBoardSquare = ([rowIndex, columnIndex]) => {
    return _board[rowIndex][columnIndex] === `` ? true : false;
  };

  const isWinningBoardSquare = ([rowIndex, columnIndex]) => {
    return _winBoard[rowIndex][columnIndex];
  };

  const checkWin = () => {
    let isWin = false; 
    // Check each row for win
    for (let rowIndex = 0; rowIndex < _board.length; rowIndex++) {
      if (_isWinInRow(rowIndex)) {
        isWin = true; 
      }
    }

    // Check each column for win
    for (let columnIndex = 0; columnIndex < _board.length; columnIndex++) {
      if (_isWinInColumn(columnIndex)) {
        isWin = true; 
      }
    }

    // Check diagonals for win
    if (_isWinInLeftDiagonal() || _isWinInRightDiagonal()) {
      isWin = true; 
    }

    // All rows, columns and diagonals have been checked, there is no win
    return isWin;
  };

  const resetBoard = () => {
    _board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        _board[rowIndex][columnIndex] = ``;
      });
    });

    _winBoard.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        _winBoard[rowIndex][columnIndex] = ``;
      });
    });
  };

  return {
    setBoardSquare,
    getSize,
    getBoardSquare,
    getEmptyBoardSquares,
    isEmptyBoardSquare,
    isWinningBoardSquare,
    checkWin,
    resetBoard,
  };
};

export { GameBoard };
