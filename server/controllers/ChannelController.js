const fs = require('fs');
const path = require('path');
const channelsFilePath = path.join(__dirname, '../channels.json');
let channels = require(channelsFilePath);

const saveChannels = () => {
    fs.writeFileSync(channelsFilePath, JSON.stringify(channels, null, 2)); // Save channels to file
};

class ChannelController {
    static getAllChannels(req, res) {
        res.json(channels); // Return all channels as JSON
    };

    static createChannel(req, res) {
        const { name, creator } = req.body;
        const newChannel = {
            id: Date.now().toString(), // Generate a unique ID
            name,
            creator,
            users: [creator], // Add creator to users list
            messages: []
        };
        channels.push(newChannel); // Add new channel to channels list
        saveChannels(); // Save channels to file
        res.status(201).json(newChannel); // Respond with the new channel
    }

    static updateChannel(channelId, updatedChannel) {
        channels = channels.map(channel =>
            channel.id === channelId ? updatedChannel : channel
        );
        saveChannels();
    }

    static getChannelById(channelId) {
        return channels.find(c => c.id === channelId);
    }
}

module.exports = ChannelController;
