const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const router = require('./routes');
const channelSocketHandlers = require('./socketHandler/ChannelSocketHandlers');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// Set up routes
app.use('/api', router);

// Create HTTP server and integrate with Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Attach socket handlers
channelSocketHandlers(io);

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
