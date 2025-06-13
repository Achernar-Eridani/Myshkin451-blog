const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, syncDatabase } = require('./models');
const routes = require('./routes');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 路由
app.use('/api', routes);

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '路由不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '服务器错误', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});



// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  // 同步数据库
  await syncDatabase();
  console.log(`服务器在 http://localhost:${PORT} 运行中`);
});

module.exports = app;