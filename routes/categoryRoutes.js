const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

// 公开路由
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
// 添加通过slug获取分类的路由
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// 需要管理员权限的路由
router.post('/', protect, admin, categoryController.createCategory);
router.put('/:id', protect, admin, categoryController.updateCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;