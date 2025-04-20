const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// 所有路由都需要管理员权限
router.use(protect, admin);

// 获取管理统计数据
router.get('/stats', adminController.getStats);

module.exports = router;