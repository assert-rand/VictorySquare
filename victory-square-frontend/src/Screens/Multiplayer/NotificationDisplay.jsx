import React, { useContext, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import './NotificationDisplay.scss';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const refreshNotifications = (email, token, setNotifications)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.49.2:30007/game-service/user/notification/get?email=${email}`,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    };
      
    axios.request(config)
    .then((response) => {
        if(response.data){
            setNotifications(response.data)
        }
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
    })
}

const acceptNotification = (
    token, 
    email, otherEmail, gameId, notifId, 
    navigate,
    setPlayer, setOppEmail, setGameid, setNotifid
)=>{
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://192.168.49.2:30007/game-service/game/accept?email=${email}&otherEmail=${otherEmail}&gameId=${gameId}&notifId=${notifId}`,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    };

    axios.request(config)
    .then((response) => {
        var returnedGame = response.data
        console.log("returnedGame", returnedGame)
        if(returnedGame !== gameId){
            throw Error("Something is wrong");
        }
        setPlayer("b")
        setOppEmail(otherEmail)
        setGameid(gameId)
        setNotifid(notifId)

        navigate("/game")
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

const rejectNotification = (
    token, email, otherEmail, notifId, 
)=>{
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://192.168.49.2:30007/game-service/game/reject?email=${email}&otherEmail=${otherEmail}&notifId=${notifId}`,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    };

    axios.request(config)
    .then((response) => {
        toast.success("Rejected invite", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
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

const NotificationDisplay = () => {
    const {appState, token, notifications, setNotifications, setPlayer, setOppEmail, setGameid, setNotifid} = useContext(AppContext);
    const navigate = useNavigate()

    return (
        <div className="notification-container">
            <div className="notification-header">
                <h2>Notifications</h2>
                <button 
                    className="btn btn-warning"
                    onClick={(e)=>{
                        e.preventDefault();
                        refreshNotifications(appState.user.email, token, setNotifications)
                    }}
                    aria-label="Refresh notifications"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="no-notifications">
                    No new notifications
                </div>
            ) : (
                <div className="notification-list">
                    {notifications.map((notification) => (
                        <div key={notification.gameCode} className="notification-card">
                            <div className="notification-content">
                                <div className="notification-sender">
                                    <span className="sender-name">{notification.inviterName}</span>
                                    <span className="sender-email">({notification.inviterEmail})</span>
                                </div>
                                <p className="notification-message">{notification.message}</p>
            
                            </div>
                            <div className="notification-actions">
                                <button 
                                    className="accept-button"
                                    onClick={() =>{
                                        acceptNotification(
                                            token, 
                                            appState.user.email, notification.inviterEmail, notification.gameCode, notification.id, 
                                            navigate,
                                            setPlayer, setOppEmail, setGameid, setNotifid
                                        )
                                    }}
                                >
                                    Accept
                                </button>
                                <button 
                                    className="reject-button"
                                    onClick={() => {
                                        rejectNotification(
                                            token, appState.user.email, notification.inviterEmail, notification.id
                                        )
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationDisplay;