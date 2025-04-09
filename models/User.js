// 必要的依赖
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // 加密工具
const sequelize = require('../config/database');

// 定义User模型
const User = sequelize.define('User', {
    // 定义id字段：整数类型，主键，自增
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // 定义username字段：字符串类型，不允许为空，必须唯一
    username: {
        type: DataTypes.STRING(50), // 最大长度50
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50] // 用户名长度在3-50之间
        }
    },

    // 定义email字段：字符串类型，不允许为空，必须唯一
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // 必须是有效的电子邮件格式
        }
    },

    // 定义password字段：字符串类型，不允许为空
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [6, 100] // 密码长度在6-100之间
        }
    },

    // 定义avatar字段：字符串类型，允许为空
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '/uploads/avatars/default.png'
    },

    // 定义bio字段：文本类型，允许为空
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // 定义isAdmin字段：布尔类型，默认为false
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // 表名设置为'users'
    tableName: 'users',

    // 启用时间戳，自动创建createdAt和updatedAt字段
    timestamps: true,

    // 钩子函数，在某些操作前后自动执行
    hooks: {
        // 创建用户前执行的操作
        beforeCreate: async (user) => {
            if (user.password) {
                // 生成盐值
                const salt = await bcrypt.genSalt(10);
                // 使用盐值对密码进行加密
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // 更新用户前执行的操作
        beforeUpdate: async (user) => {
            // 只有密码字段被修改时才重新加密
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// 添加实例方法：验证密码
User.prototype.validatePassword = async function(password) {
    // 比较输入的密码和存储的加密密码
    return await bcrypt.compare(password, this.password);
};

// 导出User模型，以便其他文件使用
module.exports = User;
