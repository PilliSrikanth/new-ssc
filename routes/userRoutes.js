const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protectAdmin, protectUser } = require('../middlewares/authMiddleware');

router.post('/register', protectAdmin, userController.createUser);
router.post('/login', userController.userLogin);
router.get('/me', protectUser, userController.getUserDetails);

router.get('/active', protectAdmin, userController.getActiveUsers);
router.get('/deactive', protectAdmin, userController.getDeactiveUsers);
router.get('/', protectAdmin, userController.getAllUsers);

module.exports = router;
