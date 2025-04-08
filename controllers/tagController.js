const { Tag, Post, User } = require('../models');

// 获取所有标签
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            order: [['name', 'ASC']]
        });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 获取单个标签及其文章
exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id, {
            include: {
                model: Post,
                as: 'posts',
                include: {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                },
                attributes: ['id', 'title', 'slug', 'excerpt', 'createdAt']
            }
        });
        
        if (!tag) {
            return res.status(404).json({ message: '标签不存在' });
        }
        
        res.json(tag);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 创建标签
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        
        const tag = await Tag.create({
            name
        });
        
        res.status(201).json({
            message: '标签创建成功',
            tag
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 更新标签
exports.updateTag = async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await Tag.findByPk(req.params.id);
        
        if (!tag) {
            return res.status(404).json({ message: '标签不存在' });
        }
        
        await tag.update({
            name
        });
        
        res.json({
            message: '标签更新成功',
            tag
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};

// 删除标签
exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        
        if (!tag) {
            return res.status(404).json({ message: '标签不存在' });
        }
        
        await tag.destroy();
        
        res.json({ message: '标签删除成功' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
};
