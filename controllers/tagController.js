const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Tag } = require('../models');
const { getPagination, getPagingData } = require('./Pagination.js');

const tagController = {
    createTag: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array()[0].msg });
            }

            const { name } = req.body;

            const tag = await Tag.create({ name });

            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTags: async (req, res) => {
        try {
            const { page, size, name } = req.query;

            const { limit, offset } = getPagination(page, size);

            const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

            const { count: totalItems, rows: tags } = await Tag.findAndCountAll({
                where: condition,
                limit,
                offset,
            });

            const response = getPagingData(tags, page, limit, totalItems);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = tagController;