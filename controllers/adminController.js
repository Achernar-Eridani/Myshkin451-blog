const { Post, Comment, Category, Tag, User } = require('../models');

// 获取管理统计数据
exports.getStats = async (req, res) => {
  try {
    // 获取文章总数
    const postCount = await Post.count();
    
    // 获取评论总数
    const commentCount = await Comment.count();
    
    // 获取分类总数
    const categoryCount = await Category.count();
    
    // 获取标签总数
    const tagCount = await Tag.count();
    
    // 获取用户总数
    const userCount = await User.count();
    
    res.json({
      postCount,
      commentCount,
      categoryCount,
      tagCount,
      userCount
    });
  } catch (error) {
    console.error('获取管理统计数据失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};