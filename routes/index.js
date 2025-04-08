const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

// API首页
router.get('/', (req, res) => {
  res.json({ message: '欢迎访问Myshkin451博客API' });
});

module.exports = router;