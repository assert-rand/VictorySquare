import React, { createContext, useState } from 'react';
export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        // user: {
        //     name : "subhajeet",
        //     rating : 800,
        //     stats : {
        //         humanWins : 0, humanLosses : 2, computerWins : 3, computerLosses : 1
        //     }
        // },
        user : null,
    });

    const [notifications, setNotifications] = useState([])
    const [token, setToken] = useState(null)

    const [player, setPlayer] = useState(null)
    const [oppEmail, setOppEmail] = useState(null)
    const [gameid, setGameid] = useState(null)
    const [notifid, setNotifid] = useState(null)

    const setUser = (user)=>{
        setAppState({...appState, user : user})
    }

    return (
        <AppContext.Provider value={{appState, setUser, notifications, setNotifications, token, setToken, player, setPlayer, oppEmail, setOppEmail, gameid, setGameid, notifid, setNotifid}}>
            {children}
        </AppContext.Provider>
    );
};
