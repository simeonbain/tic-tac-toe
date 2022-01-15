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
  const startScreen = document.querySelector(`.start-screen`);
  const gameScreen = document.querySelector(`.game-screen`); 

  return {
    player1Name,
    player2Name,
    player2Buttons,
    startButton,
    restartButton,
    newButton,
    boardButtons,
    status,
    startScreen,
    gameScreen
  };
})();

export { objectSelector };
