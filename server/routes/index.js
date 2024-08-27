const express = require('express');
const router = express.Router();
const UserRouter = require('./users');
const ChannelRouter = require('./channels');

router.use('/users', UserRouter);
router.use('/channels', ChannelRouter);

module.exports = router;