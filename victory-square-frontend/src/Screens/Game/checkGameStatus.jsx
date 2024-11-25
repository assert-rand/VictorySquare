import { Chess } from "chess.js";

function checkGameStatus(game, setGameStatus) {
  if (game.in_checkmate()) {
    const winner = game.turn() === "w" ? "Black" : "White";
    setGameStatus(`Checkmate! ${winner} wins.`);
    return true;
  }

  if (game.in_stalemate()) {
    setGameStatus("Stalemate! The game is a draw.");
    return true;
  }

  if (game.insufficient_material()) {
    setGameStatus("Draw! Insufficient material to continue the game.");
    return true;
  }

  if (game.in_threefold_repetition()) {
    setGameStatus("Draw! Threefold repetition detected.");
    return true;
  }

  if (game.in_draw()) {
    setGameStatus("Draw! 50-move rule or other draw condition met.");
    return true;
  }

  // If no end condition is met, the game continues
  setGameStatus(null); // No status indicates the game is ongoing
  return false;
}

export default checkGameStatus;
