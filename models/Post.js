// 引入必要的依赖
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

// 定义Post模型
const Post = sequelize.define('Post', {
    // 定义id字段：整数类型，主键，自增
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // 定义title字段：文章标题，字符串类型，不允许为空
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    // 定义slug字段：URL友好的标识符，必须唯一
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    // 定义content字段：文章内容，长文本类型
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },

    // 定义excerpt字段：文章摘要，用于预览，允许为空
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // 定义featuredImage字段：特色图片URL，允许为空
    featuredImage: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    // 定义status字段：文章状态，枚举类型
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft'
    },

    // 定义viewCount字段：浏览次数
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // 定义userId字段：外键，关联到User表
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // 引用的表名
            key: 'id'       // 引用的字段
        }
    },

    coverImage: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // 表名设置为'posts'
    tableName: 'posts',

    // 启用时间戳，自动创建createdAt和updatedAt字段
    timestamps: true,

    // 创建索引以提高查询性能
    indexes: [
        {
            name: 'posts_slug_index',
            unique: true,
            fields: ['slug']
        },
        {
            name: 'posts_user_id_index',
            fields: ['userId']
        }
    ],

    // 钩子函数，在某些操作前后自动执行
    hooks: {
        // 创建或更新文章前生成slug
        beforeValidate: (post) => {
            if (post.title && (!post.slug || post.changed('title'))) {
                // 从标题生成slug，确保URL友好
                post.slug = slugify(post.title, {
                    lower: true,      // 转为小写
                    strict: true,     // 移除特殊字符
                    locale: 'zh'      // 支持中文
                });
                
                // 添加随机字符串确保唯一性
                post.slug += '-' + Math.floor(Math.random() * 1000000).toString();
            }
        }
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
});

// 导出Post模型，以便其他文件使用
module.exports = Post;
