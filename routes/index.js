const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes); // 注意这里改为 /comments 前缀

// API首页
router.get('/', (req, res) => {
  res.json({ message: '欢迎访问Myshkin451博客API' });
});

module.exports = router;