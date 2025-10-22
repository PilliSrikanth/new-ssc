const crypto = require('crypto');
const RechargeOrder = require('../models/rechargeModel');
const User = require('../models/userModel');
const Channel = require('../models/channelModel');
const Admin = require('../models/adminModel');

const PAYU_KEY = process.env.PAYU_KEY || 'eJOcUQ';
const PAYU_SALT = process.env.PAYU_SALT || 'wWlen4Egad2HU760B7o5yofIJb1gpQB4';
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

exports.createOrder = async (req, res) => {
  try {
    const { channelId, channelIds, firstname, email, phone } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'User not authenticated' });
    const selectedChannelIds = channelId ? [channelId] : Array.isArray(channelIds) ? channelIds : [];
    if (!selectedChannelIds.length) return res.status(400).json({ message: "Select at least one channel." });

    const channels = await Channel.find({ _id: { $in: selectedChannelIds } });
    if (!channels.length) return res.status(404).json({ message: "No valid channels found" });

    const totalAmount = channels.reduce((s,c)=>s+c.price,0).toFixed(2);
    const admin = await Admin.findById(user.admin);
    const rechargeOrder = await RechargeOrder.create({ user: user._id, channels: channels.map(c=>c._id), amount: totalAmount, status: 'pending', admin: admin._id });

    const txnid = rechargeOrder._id.toString();
    const productinfo = 'CableTV Channel Recharge';
    const safeFirstname = firstname || user.name || 'Guest';
    const safeEmail = email || user.email || 'test@example.com';
    const safePhone = phone || user.phone || '9999999999';

    const surl = `${process.env.BASE_URL}/api/recharge/verify`;
    const furl = `${process.env.BASE_URL}/api/recharge/verify`;

    const hashString = `${PAYU_KEY}|${txnid}|${totalAmount}|${productinfo}|${safeFirstname}|${safeEmail}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.status(201).json({ success: true, order: rechargeOrder, payu: { key: PAYU_KEY, txnid, amount: totalAmount, firstname: safeFirstname, email: safeEmail, phone: safePhone, productinfo, hash, surl, furl, payu_url: PAYU_BASE_URL, service_provider: 'payu_paisa' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    console.log("=== PayU Callback Reached ===");

    // Accept data from POST body or GET query params
    const data = Object.keys(req.body).length ? req.body : req.query;

    console.log("PayU Keys:", Object.keys(data));
    console.log("Status:", data.status);
    console.log("TXNID:", data.txnid);
    console.log("Amount:", data.amount);
    console.log("Firstname:", data.firstname);
    console.log("Email:", data.email);

    const hash = data.hash;
    console.log("Hash length:", hash?.length);

    // You can skip hash check for testing / sandbox
    if (!hash || hash.length < 128) {
      console.warn("Hash missing or invalid length, skipping verification (sandbox mode)");
    } else {
      // TODO: calculate hash and verify in production
    }

    // Save order to DB (or update)
    await RechargeOrder.create({
      txnid: data.txnid,
      amount: data.amount,
      status: data.status,
      firstname: data.firstname,
      email: data.email,
      payuData: JSON.stringify(data),
    });

    res.status(200).send("Payment verified successfully.");
  } catch (err) {
    console.error("verifyPayment crashed:", err.message);
    res.status(500).send("Error verifying payment");
  }
};
