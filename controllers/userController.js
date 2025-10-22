const User = require('../models/userModel');
const RechargeOrder = require('../models/rechargeModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.createUser = async (req, res) => {
  try {
    const { name, phone, boxNumber, cardNumber } = req.body;
    const adminId = req.admin && req.admin._id;
    if (!adminId) return res.status(401).json({ message: 'Admin required' });
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const user = new User({ name, phone, boxNumber, cardNumber, admin: adminId });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = generateToken(user._id);
    res.json({ message: 'Login ok', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.admin._id, status: 'active', activeUntil: { $gte: new Date() } }).lean();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDeactiveUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.admin._id, status: 'inactive' }).lean();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.admin._id }).lean();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
