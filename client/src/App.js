import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import './styles/main.css';

function App() {
    return (
        <UserProvider>
            <SocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat/:channelId" element={<ChatPage />} />
                </Routes>
            </Router>
            </SocketProvider>
        </UserProvider>
    );
}

export default App;
