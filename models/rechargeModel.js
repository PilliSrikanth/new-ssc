const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  amount: Number,
  status: { type: String, default: 'pending' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  paymentDetails: Object
}, { timestamps: true });

module.exports = mongoose.model('RechargeOrder', rechargeSchema);
