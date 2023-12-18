const { validationResult } = require('express-validator');
const { Comment, User } = require('../models');
const { getPagination, getPagingData } = require('./Pagination.js');

const commentController = {
    createComment: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array()[0].msg });
            }

            const { content, postId } = req.body;

            const comment = await Comment.create({
                content,
                postId,
                authorId: req.user.id,
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getComments: async (req, res) => {
        try {
            const { page, size } = req.query;
            const { limit, offset } = getPagination(page, size);

            const { count: totalItems, rows: comments } = await Comment.findAndCountAll({
                limit,
                offset,
                include: [{ model: User, as: 'author' }],
            });

            const response = getPagingData(comments, page, limit, totalItems);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = commentController;