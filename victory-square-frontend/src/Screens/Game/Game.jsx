import './Game.scss'

import { useEffect, useState, useRef } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import checkGameStatus from './checkGameStatus';
import Alert from 'react-bootstrap/Alert';
import { AppContext } from '../../Context/AppContext';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import {toast} from 'react-toastify'

import axios from 'axios';
import { useNavigate } from 'react-router';

const checkForUpdates = (token, gameId, setGame, setGameOver, missCount, setMissCount, setCurrentPlayer, setGameStatus, game)=>{
  console.log("polling")
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:9003/game-service/game/state?id=${gameId}`,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  };
  axios.request(config)
  .then((response) => {
    if(!response.data){
      throw Error("null response");
    }
    const gameCopy = new Chess(response.data);
    console.log(gameCopy.moves.length, game.moves.length)
    if(gameCopy.moves.length > game.moves.length){
      setGame(gameCopy)
      var newPlayer = (gameCopy.turn() === 'w' ? 'white' : 'black');
      setCurrentPlayer(newPlayer);
    }
  })
  .catch((error) => {
     setMissCount(missCount + 1);
     if(missCount > 100){
        setGameStatus("Disconnected by miss count")
     }
  });
}

const withdraw = (email, otherEmail, token, navigate)=>{
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `http://localhost:9003/game-service/game/withdraw?email=${email}&otherEmail=${otherEmail}`,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  };

  axios.request(config)
  .then((response) => {
      console.log(response.data)
      navigate("/")
  })
  .catch((error) => {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
  });
}

const makeAMove = (move, game, setGame, currentPlayer, setCurrentPlayer, setGameStatus, setGameOver, token, gameid)=>{
  const gameCopy = new Chess(game.fen());
  try {
    const result = gameCopy.move(move);
    if (result) {
      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://localhost:9003/game-service/game/move?id=${gameid}&state=${gameCopy.fen()}`,
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      };
      axios.request(config)
      .then((response) => {
        if(response.data){
          setGame(gameCopy);
          var newPlayer = (gameCopy.turn() === 'w' ? 'white' : 'black');
          setCurrentPlayer(newPlayer);

          console.log("made a move", gameCopy.moves.length)
        }
      })
      .catch((error) => {
        console.log(error.message)
      });
      // checkGameStatus(gameCopy, setGameStatus)
      return true;
    }
  } catch (error) {
    return true;
  }
  return false;
}

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [currentPlayer, setCurrentPlayer] = useState(game.turn() === 'w' ? 'white' : 'black')
  const [gameStatus, setGameStatus] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [missCount, setMissCount] = useState(0)
  
  const {appState, player, oppEmail, gameid, notifid, token} = useContext(AppContext);
  const navigate = useNavigate()

  useEffect(() => {
    const triggerFunction = () => {
      if (currentPlayer !== player) {
        checkForUpdates(token, gameid, setGame, setGameOver, missCount, setMissCount, setCurrentPlayer, setGameStatus, game);
      }
    };
    const intervalId = setInterval(triggerFunction, 10000);
    return () => clearInterval(intervalId);
  }, []); 

  useEffect(()=>{
    
  }, [game])
  
  
  const onDrop = (sourceSquare, targetSquare, piece)=>{
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        piece : piece,
        promotion: "q"
    }, game, setGame, currentPlayer, setCurrentPlayer, setGameStatus, setGameOver, token, gameid)
      if (move === null) return false;
      return true;
  }


  return <div className="flex flex-col items-center gap-4 p-4 justify-content-center align-items-center">
    <div className="row">
      <div className="col-lg-6 col-md-12 d-flex justify-content-center">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardWidth={400}
          arePiecesDraggable={currentPlayer === player}
        />
      </div>
      <div className="col-lg-6 col-md-12">
        {gameStatus && (
          <Alert variant='light'>
            <Alert.Heading>Game Status</Alert.Heading>
            {gameStatus}
          </Alert>
        )}

        {!gameStatus && (
          <Alert variant='light'>
              <Alert.Heading>Current Turn</Alert.Heading>
              {currentPlayer}
          </Alert>
        )}

          <Alert variant='dark'>
              <Alert.Heading>Opponent</Alert.Heading>
              {oppEmail}
              <Button variant = "danger" className='ms-5'
                onClick={(e)=>{
                  e.preventDefault();
                  withdraw(appState.user.email, oppEmail, token, navigate)
                }}
              >
                  Withdraw
              </Button>
          </Alert>
          <Alert variant='light'>
              <Alert.Heading>Game Code</Alert.Heading>
              {gameid}
          </Alert>
          {
            gameStatus ? 
            <>Game over!<Button className='m-2' variant='warning'>Go back to home</Button></> : 
            null
          }
      </div>
    </div>
  </div>;
}