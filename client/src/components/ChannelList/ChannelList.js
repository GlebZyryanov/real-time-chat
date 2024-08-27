import React, { useState, useEffect, useContext } from 'react';
import { fetchChannels, createChannel } from '../../utils/api';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/channel-list.css';

const ChannelList = () => {
    const { user, logout } = useContext(UserContext);
    const [channels, setChannels] = useState([]);
    const [newChannelName, setNewChannelName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadChannels();
    }, []);

    const loadChannels = async () => {
        const data = await fetchChannels();
        setChannels(data);
    };

    const handleCreateChannel = async () => {
        if (newChannelName.trim()) {
            const newChannel = await createChannel(newChannelName, user);
            setChannels([...channels, newChannel]);
            setNewChannelName('');
        }
    };

    const handleJoinChannel = (channelId) => {
        navigate(`/chat/${channelId}`);
    };
    const handleBack = () => {
        logout();
        navigate('/');
    };

    return (

        <div className="channel-list-container">
            <header className="channel-header">
                <div className="channel-header-content">
                    <button onClick={handleBack}>Выход</button>
                    <div className="channel-title">
                        <h2>Каналы</h2>
                    </div>
                </div>
            </header>
            <div className="channel-card">

                <ul className="channel-list">
                    {channels.map((channel) => (
                        <li key={channel.id} onClick={() => handleJoinChannel(channel.id)}>
                            {channel.name}
                        </li>
                    ))}
                </ul>

                <div className="create-channel">
                    <input
                        type="text"
                        placeholder="Название нового канала"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                    <button onClick={handleCreateChannel}>Создать канал</button>
                </div>
            </div>
        </div>
    );
};

export default ChannelList;
