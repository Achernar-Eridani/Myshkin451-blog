const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;