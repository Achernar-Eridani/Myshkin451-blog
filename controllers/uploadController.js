const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// 上传用户头像
exports.uploadUserAvatar = async (req, res) => {
	try {
		// 检查是否有上传文件
		if (!req.file) {
			return res.status(400).json({ message: '没有上传文件' });
		}
		
		const userId = req.user.id;
		const avatarPath = `/uploads/avatars/${req.file.filename}`;
		
		// 查询用户
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: '用户不存在' });
		}
		
		// 如果用户已有头像，删除旧头像文件
		if (user.avatar && user.avatar !== '/uploads/avatars/default.png') {
			const oldAvatarPath = path.join(__dirname, '..', user.avatar);
			if (fs.existsSync(oldAvatarPath)) {
				fs.unlinkSync(oldAvatarPath);
			}
		}
		
		// 更新用户头像
		user.avatar = avatarPath;
		await user.save();
		
		res.json({
			message: '头像上传成功',
			avatar: avatarPath
		});
	} catch (error) {
		console.error('上传头像失败:', error);
		res.status(500).json({ message: '服务器错误' });
	}
};

// 上传文章图片
exports.uploadPostImage = async (req, res) => {
	try {
		// 检查是否有上传文件
		if (!req.file) {
			return res.status(400).json({ message: '没有上传文件' });
		}
		
		const imagePath = `/uploads/posts/${req.file.filename}`;
		
		// 如果指定了postId，则更新文章封面图
		if (req.params.postId) {
			const postId = req.params.postId;
			const post = await Post.findOne({
				where: {
					id: postId,
					userId: req.user.id // 确保只能更新自己的文章
				}
			});
			
			if (!post) {
				return res.status(404).json({ message: '文章不存在或无权限' });
			}
			
			// 如果文章已有封面图，删除旧文件
			if (post.coverImage) {
				const oldImagePath = path.join(__dirname, '..', post.coverImage);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}
			
			// 更新文章封面图
			post.coverImage = imagePath;
			await post.save();
			
			return res.json({
				message: '文章封面图更新成功',
				coverImage: imagePath
			});
		}
		
		// 如果没有指定postId，则只返回上传的图片路径（用于文章编辑器内插入图片）
		res.json({
			message: '图片上传成功',
			imagePath
		});
	} catch (error) {
		console.error('上传图片失败:', error);
		res.status(500).json({ message: '服务器错误' });
	}
};

// 删除文章图片
exports.deletePostImage = async (req, res) => {
	try {
		const { filename } = req.params;
		
		// 安全检查：确保文件名不包含路径转义字符
		if (filename.includes('..') || filename.includes('/')) {
			return res.status(400).json({ message: '无效的文件名' });
		}
		
		const filePath = path.join(__dirname, '..', 'uploads', 'posts', filename);
		
		// 检查文件是否存在
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ message: '文件不存在' });
		}
		
		// 删除文件
		fs.unlinkSync(filePath);
		
		res.json({ message: '文件删除成功' });
	} catch (error) {
		console.error('删除文件失败:', error);
		res.status(500).json({ message: '服务器错误' });
	}
};