const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const { protectAdmin, protectUser } = require('../middlewares/authMiddleware');

router.post('/create', protectAdmin, channelController.createChannel);
router.get('/admin', protectAdmin, channelController.adminChannels);
router.get('/user-channels', protectUser, channelController.getChannels);
router.get('/:id', protectUser, channelController.getChannelById);

module.exports = router;
