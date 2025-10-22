const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  boxNumber: String,
  cardNumber: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, default: 'inactive' },
  activeUntil: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
