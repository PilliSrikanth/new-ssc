const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.registerAdmin = async (req, res) => {
  try {
    const { name, userId, password } = req.body;
    if (!name || !userId || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await Admin.findOne({ userId });
    if (existing) return res.status(400).json({ message: 'Admin exists' });
    const admin = new Admin({ name, userId, password });
    await admin.save();
    res.status(201).json({ message: 'Admin created', admin: { id: admin._id, name: admin.name, userId: admin.userId }, token: generateToken(admin._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const ok = await admin.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid password' });
    res.json({ message: 'Login ok', token: generateToken(admin._id), admin: { id: admin._id, name: admin.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
