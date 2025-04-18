const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

// 公开路由
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// 需要登录的路由
router.post('/', protect, postController.createPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);
router.put('/:id/tags', protect, postController.managePostTags);
router.get('/:postId/comments', commentController.getPostComments);
router.post('/:postId/comments', protect, commentController.createComment);
router.get('/search', postController.searchPosts);


module.exports = router;