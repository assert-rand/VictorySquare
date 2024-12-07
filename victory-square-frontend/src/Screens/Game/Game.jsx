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

const withdraw = (email, otherEmail, token, navigate)=>{
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `http://192.168.49.2:30007/game-service/game/withdraw?email=${email}&otherEmail=${otherEmail}`,
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

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState(null)
  const [moveCt, setMoveCt] = useState(0)

  const {appState, player, oppEmail, gameid, notifid, token} = useContext(AppContext);
  const navigate = useNavigate()

  const doPolling = ()=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://192.168.49.2:30007/game-service/game/state?id=${gameid}`,
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    };
    axios.request(config)
    .then((response) => {
      if(response.data){
         var onlineMoveCt = response.data.moveCount;
         var onlineGame = response.data.gameString;
         if(onlineMoveCt >= moveCt + 1){
            setGame(new Chess(onlineGame));
            setMoveCt(onlineMoveCt);
            checkGameStatus(new Chess(onlineGame), setGameStatus)
         }
      }
    })
    .catch((error) => {
    });
  }

  const makeMove = (move)=>{
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        let config = {
          method: 'patch',
          maxBodyLength: Infinity,
          url: `http://192.168.49.2:30007/game-service/game/move?id=${gameid}&state=${gameCopy.fen()}&email=${appState.user.email}`,
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        };
        axios.request(config)
        .then((response) => {
          if(response.data){
            setGame(gameCopy);
            setMoveCt(moveCt + 1);
            checkGameStatus(gameCopy, setGameStatus)
          }
        })
        .catch((error) => {
        });
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  useEffect(() => {
    const triggerFunction = () => {
      doPolling();
    };
    const intervalId = setInterval(triggerFunction, 1000);
    return () => clearInterval(intervalId);
  }, []); 
  
  
  const onDrop = (sourceSquare, targetSquare, piece)=>{
      const move = makeMove({
        from: sourceSquare,
        to: targetSquare,
        piece : piece,
        promotion: "q"
    })
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
          arePiecesDraggable={true}
        />
      </div>
      <div className="col-lg-6 col-md-12">
        <div className="m-2">
          You are playing on the <b>{player === 'w' ? "WHITE" : "BLACK"}</b> team.
        </div>
        {gameStatus && (
          <Alert variant='light'>
            <Alert.Heading>Game Status</Alert.Heading>
            {gameStatus}
          </Alert>
        )}

        {!gameStatus && (
          <Alert variant='light'>
              <Alert.Heading>Current Turn</Alert.Heading>
                {moveCt % 2 == 1 ? "BLACK team's move" : "WHITE team's move"}
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
            <>Game over!<Button className='m-2' variant='warning'
              onClick={(e)=>{
                e.preventDefault();
                navigate("/")
              }}
            >Claim victory</Button></> : 
            null
          }
      </div>
    </div>
  </div>;
}