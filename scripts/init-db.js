const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { sequelize, User, Category, Tag, syncDatabase } = require('../models');

async function init() {
  try {
    // 使用已有的syncDatabase函数
    await syncDatabase();
    console.log('✅ 数据库表结构同步完成');

    // 创建默认管理员
    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',   // User模型会自动bcrypt加密
        isAdmin: true,
      },
    });

    console.log(created ? '✅ 管理员账户已创建' : 'ℹ️  管理员账户已存在');

    // 创建默认分类（可选）
    const [defaultCategory] = await Category.findOrCreate({
      where: { name: '默认分类' },
      defaults: {
        name: '默认分类',
        description: '默认的文章分类'
      }
    });

    console.log('✅ 默认分类已准备');

  } catch (err) {
    console.error('❌ 初始化失败:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

init();