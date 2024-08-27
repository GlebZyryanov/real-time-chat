import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { fetchChannels } from '../utils/api';
import UserSearch from '../components/UserSearch/UserSearch';
import "../styles/chat-page.css";

const ChatPage = () => {
    const { channelId } = useParams();
    const { user } = useContext(UserContext);
    const [channel, setChannel] = useState(null);
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);  // Держим состояние пользователей отдельно
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (channelId) {
            loadChannelData();
        }
    }, [users]);

    useEffect(() => {
        if (user) {
            socket.emit('join_channel', { channelId, user });
            loadChannelData();

            socket.on('receive_message', (newMessage) => {

                setChannel((prev) => ({
                    ...prev,
                    messages: [...prev.messages, newMessage]
                }));
                scrollToBottom();
            });

            socket.on('channel_updated', (updatedChannel) => {

                setChannel(updatedChannel);

            });

            return () => {
                socket.emit('leave_channel', { channelId, userId: user.id }); // Notify server that the user left the channel
                socket.off('receive_message'); // Clean up the receive_message listener
                socket.off('channel_updated'); // Clean up the channel_updated listener
            };
        }
    }, [channelId, user]);

    const loadChannelData = async () => {
        const channels = await fetchChannels(); // Fetch channels from the server
        const currentChannel = channels.find((c) => c.id === channelId);
        setChannel(currentChannel);
        setUsers(currentChannel.users);

    };

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: message,
                sender: user,
                timestamp: new Date().toISOString()
            };
            socket.emit('send_message', { channelId, message: newMessage });// Send the message to the server
            setChannel((prev) => ({
                ...prev,
                messages: [...prev.messages, newMessage] // Update the channel with the new message
            }));
            setMessage(''); // Clear the message input and scroll to the bottom
            setTimeout(() => {
                scrollToBottom();

            }, 5);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });// Smooth scroll to the bottom of the messages

    };

    const handleRemoveUser = (userId) => {
        socket.emit('remove_user', { channelId, userId });
    };

    if (!channel) return <div>Загрузка...</div>;

    return (
        <div className="chat-page-container">
            <header className="chat-header">
                <h2>{channel.name}</h2>
            </header>
            <div className="chat-content">
                <div className="channel-users-card">
                    <div className="channel-users">
                        <h2>Участники:</h2>
                        <ul>
                            {users.map((u) => (
                                <li key={u.id}>
                                    <h4>{u.name}</h4>
                                    {channel.creator.id === user.id && u.id !== user.id && (
                                        <button onClick={() => handleRemoveUser(u.id)}>Удалить</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="user-search-container">
                        {channel.creator.id === user.id && <UserSearch channelId={channelId}/>}
                    </div>
                </div>

                <div className="chat-messages-card">
                    <div className="chat-messages">
                        {channel.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message ${msg.sender.id === user.id ? 'own' : ''}`}
                            >
                                <span className="sender">{msg.sender.name}:</span>
                                <span className="text">{msg.text}</span>
                                <span className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Введите сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage}>Отправить</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ChatPage;
