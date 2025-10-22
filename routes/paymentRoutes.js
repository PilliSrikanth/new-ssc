const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/response', paymentController.response);
router.get('/response', paymentController.response);

module.exports = router;
