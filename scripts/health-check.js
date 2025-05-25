const { sequelize } = require('../models');

sequelize.authenticate()
  .then(() => {
    console.log('✅ 数据库连接成功');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err);
    process.exit(1);
  });