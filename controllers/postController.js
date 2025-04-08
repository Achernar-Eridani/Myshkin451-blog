const { Post, User } = require('../models');

// 获取所有文章
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 获取单篇文章
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: {
                model: User,
                as: 'author',
                attributes: ['id', 'username']
            }
        });
        
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        // 增加浏览次数
        post.viewCount += 1;
        await post.save();
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 创建文章
exports.createPost = async (req, res) => {
    try {
        const { title, content, excerpt, status, categoryId } = req.body;
        
        const post = await Post.create({
            title,
            content,
            excerpt,
            status: status || 'draft',
            userId: req.user.id, // 从JWT中获取的用户ID
            categoryId: categoryId || null
        });
        
        res.status(201).json({
            message: '文章创建成功',
            post
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 更新文章
exports.updatePost = async (req, res) => {
    try {
        const { title, content, excerpt, status, categoryId } = req.body;
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        // 检查权限（只有作者或管理员可以更新）
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: '没有权限修改此文章' });
        }
        
        // 更新文章
        await post.update({
            title,
            content,
            excerpt,
            status,
            categoryId: categoryId || post.categoryId
        });
        res.json({
            message: '文章更新成功',
            post
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 删除文章
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        // 检查权限（只有作者或管理员可以删除）
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: '没有权限删除此文章' });
        }
        
        // 删除文章
        await post.destroy();
        
        res.json({ message: '文章删除成功' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};
