const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

// 注册新用户
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 检查用户名是否已存在
        const usernameExists = await User.findOne({ where: { username } });
        // 检查邮箱是否已存在 
        const emailExists = await User.findOne({ where: { email } });
    
        if (usernameExists || emailExists) {
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
                email: user.email,
                isAdmin: user.isAdmin 
            }
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 查找用户
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        
        // 验证密码
        const isPasswordValid = await user.validatePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: '密码错误' });
        }
        
        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );
        
        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin 
            }
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};