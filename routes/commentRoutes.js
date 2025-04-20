const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, admin } = require('../middlewares/authMiddleware');

// 公开路由 - 获取文章评论
router.get('/:commentId', commentController.getPostComments);

router.put('/:commentId', protect, commentController.updateComment);
router.delete('/:commentId', protect, commentController.deleteComment);
router.patch('/:commentId/moderate', protect, admin, commentController.moderateComment);

// 在 routes/commentRoutes.js 中添加以下路由

// 获取最近评论
router.get('/recent', protect, admin, commentController.getRecentComments);

// 获取所有评论(管理员用)
router.get('/all', protect, admin, commentController.getAllComments);

module.exports = router;