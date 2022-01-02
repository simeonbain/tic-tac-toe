/* -- Game Board -- */
const gameBoard = (() => {
  const _board = [
    [``, ``, ``],
    [``, ``, ``],
    [``, ``, ``],
  ];

  const _isWinInRow = (rowIndex) => {
    for (let columnIndex = 0; columnIndex < _board.length - 1; columnIndex++) {
      if (
        _board[rowIndex][columnIndex] === `` ||
        _board[rowIndex][columnIndex] !== _board[rowIndex][columnIndex + 1]
      ) {
        return false;
      }
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
    return true;
  };

  const _isWinInLeftDiagonal = () => {
    let count = 1;
    for (let i = 0; i < _board.length - 1; i++) {
      if (_board[i][i] !== `` && _board[i][i] === _board[i + 1][i + 1]) {
        count++;
      }
    }

    return count === _board.length ? true : false;
  };

  const _isWinInRightDiagonal = () => {
    let count = 1;
    for (let i = 0, j = _board.length - 1; i < _board.length - 1; i++, j--) {
      if (_board[i][j] !== `` && _board[i][j] === _board[i + 1][j - 1]) {
        count++;
      }
    }

    return count === _board.length ? true : false;
  };

  const setBoardSquare = ([rowIndex, columnIndex], value) => {
    if (_board[rowIndex][columnIndex] === ``) {
      _board[rowIndex][columnIndex] = value;
    }
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

  const isBoardSquareEmpty = ([rowIndex, columnIndex]) => {
    return _board[rowIndex][columnIndex] === `` ? true : false;
  };

  const checkWin = () => {
    // Check each row for win
    for (let rowIndex = 0; rowIndex < _board.length; rowIndex++) {
      if (_isWinInRow(rowIndex)) {
        return true;
      }
    }

    // Check each column for win
    for (let columnIndex = 0; columnIndex < _board.length; columnIndex++) {
      if (_isWinInColumn(columnIndex)) {
        return true;
      }
    }

    // Check diagonals for win
    if (_isWinInLeftDiagonal() || _isWinInRightDiagonal()) {
      return true;
    }

    // All rows, columns and diagonals have been checked, there is no win
    return false;
  };

  const resetBoard = () => {
    _board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        _board[rowIndex][columnIndex] = ``;
      });
    });
  };

  return {
    setBoardSquare,
    getBoardSquare,
    getEmptyBoardSquares,
    isBoardSquareEmpty,
    checkWin,
    resetBoard,
  };
})();

export { gameBoard };
