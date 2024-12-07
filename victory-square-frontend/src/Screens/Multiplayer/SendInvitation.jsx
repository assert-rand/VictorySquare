import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import './SendInvitation.scss';
import axios from 'axios';

import { AppContext } from '../../Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router';

const handleSearch = (searchterm, setError, setLoading, setPlayerData, token) => {
    setError('');
    setLoading(true);

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.49.2:30007/game-service/user/search?email=${searchterm}`,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    };
      
    axios.request(config)
    .then((response) => {
        setPlayerData(response.data)
    })
    .catch((error) => {
        setError('Player not found. Please check the ID and try again.');
        setPlayerData(null);
    }).finally(()=>{
        setLoading(false);
    });
};

const handleChallenge = (
    token, 
    email, 
    user, 
    setChallenge, 
    navigate, 
    setPlayer, setOppEmail, setGameid
) => {
    setChallenge(1);
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://192.168.49.2:30007/game-service/game/create?email=${user.email}&otherEmail=${email}`,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    };

    axios.request(config)
    .then((response) => {
        var gameCode = response.data;
        console.log(response.data);
        setChallenge(2);
        if(!gameCode){
            throw Error("Couldn't");
        }
        let data = JSON.stringify({
            "inviteeEmail": user.email,
            "inviteeName": user.name,
            "message": `Your friend here has invited you to join the game with code ${gameCode}`,
            "gameCode": gameCode
        });
        let anotherConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `http://192.168.49.2:30007/game-service/user/invite?email=${email}`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
            },
            data : data
        };

        axios.request(anotherConfig)
        .then((response)=>{
            if(!response.data.success){
                throw Error("Didn't work out");
            }
        })
        .catch((error)=>{
            setChallenge(0);
        }).finally(()=>{
            setPlayer("w")
            setOppEmail(email)
            setGameid(gameCode)
            navigate("/game")
        })
    })
    .catch((error) => {
        setChallenge(0);
    })
};

const SendInvitation = () => {
    const [playerId, setPlayerId] = useState('');
    const [playerData, setPlayerData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [challenge, setChallenge] = useState(0);
    const navigate = useNavigate()
    
    const {token, appState, setPlayer, setOppEmail, setGameid} = useContext(AppContext)

    return (
        <Container className="send-invitation-container">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <h2 className="text-center mb-4">Challenge a Player</h2>
                    
                    <Form onSubmit={(e)=>{
                        e.preventDefault()
                        handleSearch(playerId, setError, setLoading, setPlayerData, token)
                    }} className="search-form mb-4">
                        <Form.Group className="search-input-group">
                            <Form.Control
                                type="text"
                                placeholder="Enter player ID"
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                disabled={loading}
                            />
                            <Button 
                                variant="warning" 
                                type="submit" 
                                disabled={!playerId || loading}
                                className="search-button"
                            >
                                <Search /> Search
                            </Button>
                        </Form.Group>
                    </Form>

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {loading && (
                        <div className="text-center">
                            <span className="spinner-border text-primary" role="status" />
                        </div>
                    )}

                    {playerData && (
                        <Card className="player-card">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title>{playerData.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            Email: {playerData.email}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            Win Rate: {parseInt((playerData.humanGamesWon/ (playerData.humanGamesWon + playerData.humanGamesLost)) * 10000)/100}%
                                        </Card.Text>
                                    </div>
                                    <Button 
                                        variant="success" 
                                        onClick={()=>{
                                            handleChallenge(
                                                token, 
                                                playerData.email, 
                                                appState.user, 
                                                setChallenge, 
                                                navigate,
                                                setPlayer, setOppEmail, setGameid
                                            )
                                        }}
                                        className="challenge-button"
                                    >
                                        Challenge
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
            <Row>
                {
                    challenge == 0 ? 
                    null : 
                    (
                    <h4 className="text-center m-4">
                        {
                            challenge == 1 ? 
                            "Creating a game ..." : 
                            "Waiting for the other player to accept..."
                        }
                        <div className="text-center m-3">
                            <span className="spinner-border text-warning" role="status" />
                        </div>
                    </h4>
                    )
                }
            </Row>
        </Container>
    );
};

export default SendInvitation;