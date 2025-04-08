const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');


router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);


// API首页
router.get('/', (req, res) => {
  res.json({ message: '欢迎访问Myshkin451博客API' });
});

module.exports = router;