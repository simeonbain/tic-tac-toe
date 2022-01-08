/* -- State -- */
const gameState = (() => {
  const INITIAL = 0;
  const IN_PROGRESS = 1;
  const WIN = 2;
  const DRAW = 3;

  return {
    INITIAL,
    IN_PROGRESS,
    WIN,
    DRAW,
  };
})();

export { gameState };
