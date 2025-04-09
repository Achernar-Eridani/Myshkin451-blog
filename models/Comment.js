// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define(
	'Comment',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('pending', 'approved', 'rejected'),
			defaultValue: 'approved', 
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'posts',
				key: 'id'
			}
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'comments',
				key: 'id'
			}
		}
	},
	{
		tableName: 'comments',
		timestamps: true
	}
);

module.exports = Comment;