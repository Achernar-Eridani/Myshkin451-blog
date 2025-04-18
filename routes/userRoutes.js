const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');


// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);
// 个人中心相关路由
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.put('/password', protect, userController.updatePassword);
router.get('/posts', protect, userController.getUserPosts);
router.get('/comments', protect, userController.getUserComments);

module.exports = router;