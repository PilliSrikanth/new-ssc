const express = require('express');
const router = express.Router();
const rechargeController = require('../controllers/rechargeController');
const { protectUser } = require('../middlewares/authMiddleware');

router.post('/create-order', protectUser, rechargeController.createOrder);
router.post('/verify', rechargeController.verifyPayment); // optional manual verify
module.exports = router;
