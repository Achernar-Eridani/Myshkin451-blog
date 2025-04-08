const { Post, User, Category, Tag } = require('../models');

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
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] } // 不包含中间表字段
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
        const { title, content, excerpt, status, categoryId, tagIds } = req.body;
    
        const post = await Post.create({
            title,
            content,
            excerpt,
            status: status || 'draft',
            userId: req.user.id,
            categoryId: categoryId || null
        });
    
        // 如果提供了标签，则添加标签关联
        if (tagIds && tagIds.length > 0) {
            await post.addTags(tagIds);
        }
    
        // 重新查询文章，包含关联数据
        const newPost = await Post.findByPk(post.id, {
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
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] }
                }
            ]
        });
    
        res.status(201).json({
            message: '文章创建成功',
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 修改updatePost方法，支持更新标签
exports.updatePost = async (req, res) => {
    try {
        const { title, content, excerpt, status, categoryId, tagIds } = req.body;
        const post = await Post.findByPk(req.params.id);
    
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
    
        // 检查权限
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: '没有权限修改此文章' });
        }
    
        // 更新文章基本信息
        await post.update({
            title,
            content,
            excerpt,
            status,
            categoryId: categoryId || post.categoryId
        });
    
        // 如果提供了标签，则更新标签关联
        if (tagIds) {
            // 首先移除所有现有标签
            await post.setTags([]);
            // 然后添加新标签
            if (tagIds.length > 0) {
                await post.addTags(tagIds);
            }
        }
    
        // 重新查询文章，包含关联数据
        const updatedPost = await Post.findByPk(post.id, {
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
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'slug'],
                    through: { attributes: [] }
                }
            ]
        });
    
        res.json({
            message: '文章更新成功',
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 管理文章标签
exports.managePostTags = async (req, res) => {
    try {
        const { tagIds } = req.body;
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        // 检查权限
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: '没有权限修改此文章的标签' });
        }
        
        // 更新标签
        if (tagIds && Array.isArray(tagIds)) {
            await post.setTags(tagIds);
        }
        
        // 获取更新后的标签
        const updatedPost = await Post.findByPk(post.id, {
            include: {
                model: Tag,
                as: 'tags',
                attributes: ['id', 'name', 'slug'],
                through: { attributes: [] }
            }
        });
        
        res.json({
            message: '文章标签更新成功',
            tags: updatedPost.tags
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
