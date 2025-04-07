// 引入数据库连接和模型
const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

// 定义模型之间的关联关系

// 用户与文章的关系：一对多
// 一个用户可以有多篇文章
User.hasMany(Post, {
foreignKey: 'userId',
as: 'posts',
onDelete: 'CASCADE' // 当用户被删除时，其所有文章也被删除
});

// 一篇文章属于一个用户
Post.belongsTo(User, {
foreignKey: 'userId',
as: 'author'
});

// 同步数据库模型（在开发环境中）
const syncDatabase = async () => {
try {
    if (process.env.NODE_ENV === 'development') {
    // 使用{ force: true }会删除已存在的表并重新创建
    // 小心使用！在生产环境中绝不应该这样做
    await sequelize.sync({ alter: true });
    console.log('数据库同步完成');
    }
} catch (error) {
    console.error('数据库同步失败:', error);
}
};

// 导出模型和同步函数
module.exports = {
sequelize,
User,
Post,
syncDatabase
};