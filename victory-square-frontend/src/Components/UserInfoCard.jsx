import React from 'react';
import {Card} from 'react-bootstrap';

const UserInfoCard = ({user}) => {
    return (
        <Card className='userInfo m-3' bg = "warning"
            style = {{
                width : "96%",
                borderRadius : "100px"
            }}
        >
            <Card.Body className="cardbody">
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {user.name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {user.email}
                </Card.Subtitle>
                <Card.Text>
                    <div className="row">
                        <div className="col-6 d-flex justify-content-center">
                            <div 
                                style={{
                                    backgroundColor : "white",
                                    width : "200px",
                                    padding : "20px",
                                    fontSize : "1.2rem",
                                    borderRadius : "30px"
                                }}
                            >
                                <b>Against humans</b>
                                <br/>
                                {`${user.humanGamesWon} wins / ${user.humanGamesLost} losses`}
                            </div>
                        </div>
                        <div className="col-6 d-flex justify-content-center">
                            <div 
                                style={{
                                    backgroundColor : "white",
                                    width : "200px",
                                    padding : "20px",
                                    fontSize : "1.2rem",
                                    borderRadius : "30px"
                                }}
                            >
                                <b>Against engine</b>
                                <br/>
                                {`${user.computerGamesWon} wins / ${user.computerGamesLost} losses`}
                            </div>
                        </div>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default UserInfoCard;
