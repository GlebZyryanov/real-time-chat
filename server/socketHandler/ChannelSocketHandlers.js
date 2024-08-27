const ChannelController = require('../controllers/ChannelController');

const ChannelSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join_channel', ({ channelId, user }) => {
            const channel = ChannelController.getChannelById(channelId);
            if (channel) {
                socket.join(channelId); // User joins the channel room
                if (!channel.users.find(u => u.id === user.id)) {
                    channel.users.push(user); // Add user to channel
                    ChannelController.updateChannel(channelId, channel); // Update the channel with new user
                    console.log(`User ${user.name} added to channel ${channelId}`);
                    io.to(channelId).emit('channel_updated', channel); // Notify all users in the channel
                }
                console.log(`${user.name} joined channel ${channel.name}`);
            }
        });

        socket.on('leave_channel', ({ channelId, userId }) => {
            const channel = ChannelController.getChannelById(channelId);
            if (channel) {
                channel.users = channel.users.filter(u => u.id !== userId); // Remove user from channel
                ChannelController.updateChannel(channelId, channel); // Save updated channel
                socket.leave(channelId); // User leaves the channel room
                io.to(channelId).emit('channel_updated', channel); // Notify all users in the channel
                console.log(`User ${userId} left channel ${channel.name}`);
            }
        });

        socket.on('send_message', ({ channelId, message }) => {
            const channel = ChannelController.getChannelById(channelId);
            if (channel) {
                channel.messages.push(message); // Add message to the channel
                ChannelController.updateChannel(channelId, channel); // Save updated channel
                io.to(channelId).emit('receive_message', message); // Broadcast the message to the channel
            }
        });

        socket.on('remove_user', ({ channelId, userId }) => {
            const channel = ChannelController.getChannelById(channelId);
            if (channel) {
                channel.users = channel.users.filter(u => u.id !== userId); // Remove user from channel
                ChannelController.updateChannel(channelId, channel); // Save updated channel
                io.to(channelId).emit('channel_updated', channel); // Notify all users in the channel
                io.to(channelId).emit('user_removed', userId); // Notify that user was removed
                console.log(`User ${userId} removed from channel ${channel.name}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = ChannelSocketHandlers;
