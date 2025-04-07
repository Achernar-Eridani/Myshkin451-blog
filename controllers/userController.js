const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 需要安装：npm install jsonwebtoken

// 注册新用户
exports.register = async (req, res) => {
try {
    const { username, email, password } = req.body;
    
    // 检查用户名或邮箱是否已存在
    const userExists = await User.findOne({ 
    where: {
        [sequelize.Op.or]: [{ username }, { email }]
    } 
    });
    
    if (userExists) {
    return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }
    
    // 创建新用户
    const user = await User.create({
    username,
    email,
    password, // 密码会在model的hook中自动加密
    isAdmin: false // 默认非管理员
    });
    
    // 生成JWT令牌
    const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
    );
    
    res.status(201).json({
    message: '注册成功',
    token,
    user: {
        id: user.id,
        username: user.username,
        email: user.email
    }
    });
} catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
}
};

