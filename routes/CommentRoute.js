const express = require('express');
const commentController = require('../controllers/commentController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/comments', commentController.getComments);
router.post('/comments', authMiddleware, commentController.createComment);

module.exports = router;