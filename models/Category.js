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
hooks: {
    beforeValidate: (category) => {
    if (category.name && (!category.slug || category.changed('name'))) {
        category.slug = slugify(category.name, {
        lower: true,
        strict: true
        });
    }
    }
}
});

module.exports = Category;