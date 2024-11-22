import "./Home.scss"
import { AppContext } from '../../Context/AppContext';
import { useContext } from 'react';

import Hero from "../../Components/Hero";
import UserInfoCard from "../../Components/UserInfoCard";

const Home = ()=>{
    const {appState} = useContext(AppContext);

    return <div className="home">
        {
            appState.user === null ? 
            null : <
                UserInfoCard user = {appState.user}
            />
        }

        <Hero></Hero>
    </div>
}

export default Home;