// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const createUploadDirs = () => {
	const dirs = ['uploads', 'uploads/avatars', 'uploads/posts'];
	dirs.forEach(dir => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	});
};

createUploadDirs();

// 存储配置
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let uploadPath = 'uploads/';
		
		// 根据上传类型决定存储路径
		if (req.uploadType === 'avatar') {
			uploadPath += 'avatars/';
		} else if (req.uploadType === 'post') {
			uploadPath += 'posts/';
		}
		
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		// 生成文件名: 时间戳 + 随机字符 + 原始扩展名
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const ext = path.extname(file.originalname);
		cb(null, uniqueSuffix + ext);
	}
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
	// 允许的文件类型
	const allowedTypes = /jpeg|jpg|png|gif|webp/;
	const ext = path.extname(file.originalname).toLowerCase();
	const mimetype = allowedTypes.test(file.mimetype);
	
	if (mimetype && allowedTypes.test(ext)) {
		return cb(null, true);
	} else {
		cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'));
	}
};

// 创建上传配置
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024 // 限制5MB
	},
	fileFilter: fileFilter
});

// 用户头像上传中间件
exports.uploadAvatar = (req, res, next) => {
	req.uploadType = 'avatar';
	return upload.single('avatar')(req, res, function (err) {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		next();
	});
};

// 文章图片上传中间件
exports.uploadPostImage = (req, res, next) => {
	req.uploadType = 'post';
	return upload.single('image')(req, res, function (err) {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		next();
	});
};