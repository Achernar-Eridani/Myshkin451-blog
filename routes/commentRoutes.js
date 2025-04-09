const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, admin } = require('../middlewares/authMiddleware');

// 公开路由 - 获取文章评论
router.get('/:commentId', commentController.getPostComments);

router.put('/:commentId', protect, commentController.updateComment);
router.delete('/:commentId', protect, commentController.deleteComment);
router.patch('/:commentId/moderate', protect, admin, commentController.moderateComment);



module.exports = router;