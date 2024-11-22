import './Game.scss'

import { useState } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Game() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

    const onDrop = (sourceSquare, targetSquare, piece)=>{
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            piece : piece,
            promotion: "q"
        });
        
        if (move === null) return false;
        setTimeout(makeRandomMove, 200);
        return true;
    }

  return <Chessboard onPieceDrop={onDrop} position={game.fen()} boardWidth={450}/>;
}