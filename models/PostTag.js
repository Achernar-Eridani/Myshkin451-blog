const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostTag = sequelize.define('PostTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tags',
            key: 'id'
        }
    }
}, {
    tableName: 'post_tags',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['postId', 'tagId'] // 确保一篇文章不会重复添加同一个标签
        }
    ]
});

module.exports = PostTag;
