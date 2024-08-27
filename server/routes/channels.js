const express = require('express');
const router = express.Router();
const ChannelController = require('../controllers/ChannelController');

router.get('/', ChannelController.getAllChannels);
router.post('/', ChannelController.createChannel);

module.exports = router;