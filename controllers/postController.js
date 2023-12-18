const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Post, Category, Tag, User, Comment } = require('../models');
const { getPagination, getPagingData } = require('./Pagination.js');

const postController = {
    getPosts: async (req, res) => {
        try {
            const { page, size, title } = req.query;

            const { limit, offset } = getPagination(page, size);

            const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

            const { count: totalItems, rows: posts } = await Post.findAndCountAll({
                where: condition,
                limit,
                offset,
                include: [
                    { model: Category, as: 'category' },
                    { model: Tag, as: 'tags' },
                    { model: User, as: 'author' },
                    { model: Comment, as: 'comments' },
                ],
            });

            const response = getPagingData(posts, page, limit, totalItems);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await Post.findOne({
                where: { id: req.params.id },
                include: [
                    { model: Category, as: 'category' },
                    { model: Tag, as: 'tags' },
                    { model: User, as: 'author' },
                    { model: Comment, as: 'comments' },
                ],
            });

            if (!post) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createPost: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array()[0].msg });
            }

            const { title, content, categoryId, tags } = req.body;

            const post = await Post.create({
                title,
                content,
                categoryId,
                userId: req.user.id,
            });

            if (tags && tags.length > 0) {
                const tagObjects = await Tag.findAll({ where: { name: tags } });
                await post.addTags(tagObjects);
            }

            res.status(201).json({ message: "Post berhasil dibuat", data: post });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePost: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array()[0].msg });
            }

            const { title, content, categoryId, tags } = req.body;

            const post = await Post.findOne({ where: { id: req.params.id } });

            if (!post) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }

            if (post.userId !== req.user.id) {
                return res.status(403).json({ message: "Anda tidak memiliki akses untuk mengupdate post ini" });
            }

            await post.update({
                title,
                content,
                categoryId,
            });

            if (tags && tags.length > 0) {
                const tagObjects = await Tag.findAll({ where: { name: tags } });
                await post.setTags(tagObjects);
            }

            res.status(200).json({ message: "Post berhasil diupdate", data: post });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findOne({ where: { id: req.params.id } });

            if (!post) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }

            if (post.userId !== req.user.id) {
                return res.status(403).json({ message: "Anda tidak memiliki akses untuk menghapus post ini" });
            }

            await post.destroy();

            res.status(200).json({ message: "Post berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = postController;