const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'tags',
    timestamps: true,
    hooks: {
        beforeValidate: (tag) => {
            if (tag.name && (!tag.slug || tag.changed('name'))) {
                tag.slug = slugify(tag.name, {
                    lower: true,
                    strict: true
                });
            }
        }
    }
});

module.exports = Tag;
