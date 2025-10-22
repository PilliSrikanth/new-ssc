const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  title: String,
  channelsCount: Number,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
