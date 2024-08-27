import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Login from '../components/Login/Login';
import ChannelList from '../components/ChannelList/ChannelList';

const Home = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="home-page">
            {user ? <ChannelList /> : <Login />}
        </div>
    );
};

export default Home;
