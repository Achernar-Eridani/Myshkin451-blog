const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    }, {
    tableName: 'categories',
    timestamps: true,
    // 在 models/Category.js 和 models/Tag.js 中
    hooks: {
        beforeValidate: (model) => {
            if (model.name && (!model.slug || model.changed('name'))) {
                // 改进 slugify 配置以处理中文字符
                let tempSlug = slugify(model.name, {
                    lower: true,      // 转为小写
                    strict: true,     // 移除特殊字符
                    locale: 'zh'      // 中文支持
                });
                
                // 如果生成的 slug 为空（可能只有中文字符时）
                if (!tempSlug || tempSlug.length === 0) {
                    tempSlug = 'item-' + Date.now().toString(36);
                }
                
                // 如果 slug 只包含数字，添加前缀
                if (/^\d+$/.test(tempSlug)) {
                    tempSlug = 'item-' + tempSlug;
                }
                
                // 确保唯一性
                model.slug = tempSlug + '-' + Math.floor(Math.random() * 1000).toString();
            }
        }
    }
});

module.exports = Category;