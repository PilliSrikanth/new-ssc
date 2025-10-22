const Channel = require('../models/channelModel');
const mongoose = require('mongoose');

exports.adminChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ admin: req.admin._id }).sort({ price: 1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createChannel = async (req, res) => {
  try {
    const { title, channelsCount, price } = req.body;
    const adminId = req.admin._id;
    const channel = await Channel.create({ admin: adminId, title, channelsCount: channelsCount||0, price });
    res.status(201).json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ admin: req.user.admin }).sort({ price: 1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
