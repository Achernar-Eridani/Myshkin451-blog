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

exports.createPost = async (req, res) => {
    try {
        // 👇 1. 加入 coverImage 和 createdAt
        const { title, content, excerpt, status, categoryId, tagIds, coverImage, createdAt } = req.body;
    
        const post = await Post.create({
            title,
            content,
            excerpt,
            status: status || 'draft',
            userId: req.user.id,
            categoryId: categoryId || null,
            coverImage: coverImage || null, // 👇 2. 保存封面
            createdAt: createdAt || new Date() // 👇 3. 上帝模式：如果有自定义时间就用，没有就用当前时间
        });
    
        if (tagIds && tagIds.length > 0) {
            await post.addTags(tagIds);
        }
    
        const newPost = await Post.findByPk(post.id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
            ]
        });
    
        res.status(201).json({ message: '文章创建成功', post: newPost });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        // 👇 1. 加入 coverImage 和 createdAt
        const { title, content, excerpt, status, categoryId, tagIds, coverImage, createdAt } = req.body;
        const post = await Post.findByPk(req.params.id);
    
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
    
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: '没有权限修改此文章' });
        }
    
        // 👇 2. 构建更新对象
        const updateData = {
            title,
            content,
            excerpt,
            status,
            categoryId: categoryId || post.categoryId,
            coverImage: coverImage // 保存封面
        };

        // 👇 3. 上帝模式：只有当用户真的传了时间才更新它，否则保持原样
        if (createdAt) {
            updateData.createdAt = createdAt;
        }
    
        await post.update(updateData);
    
        if (tagIds) {
            await post.setTags([]);
            if (tagIds.length > 0) {
                await post.addTags(tagIds);
            }
        }
    
        const updatedPost = await Post.findByPk(post.id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
            ]
        });
    
        res.json({ message: '文章更新成功', post: updatedPost });
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

// 搜索文章
exports.searchPosts = async (req, res) => {
    try {
        const { 
            query,          
            page = 1,       
            limit = 10,     
            sortBy = 'createdAt', 
            order = 'DESC',
            status // 👇 1. 获取前端传来的 status 参数
        } = req.query;
        
        const offset = (page - 1) * limit;
        const { Op } = require('sequelize');
        
        // 👇 2. 动态构建查询条件
        const whereCondition = {};
        
        // 如果前端明确传了 status (比如管理员筛选 'draft')，就用传进来的
        // 如果没传，或者是普通用户访问，可能默认只显示 published (这里为了后台管理灵活，先不强制默认 published，由前端控制)
        if (status) {
            whereCondition.status = status;
        } else {
            // 可选：如果完全没传 status
        }

        if (query) {
            whereCondition[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
                { excerpt: { [Op.like]: `%${query}%` } }
            ];
        }
        
        const count = await Post.count({ where: whereCondition });
        
        const posts = await Post.findAll({
            where: whereCondition,
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
            ],
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        res.json({
            posts,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                hasMore: page < Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('搜索文章失败:', error);
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};