const express = require('express');
const postController = require('../controllers/postController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const ownershipMiddleware = require('../middleware/ownershipMiddleware.js');

const router = express.Router();

router.get('/posts', postController.getPosts);
router.post('/posts', authMiddleware, postController.createPost);
router.get('/posts/:id', postController.getPost);
router.patch('/posts/:id', authMiddleware, ownershipMiddleware, postController.updatePost);
router.delete('/posts/:id', authMiddleware, ownershipMiddleware, postController.deletePost);

module.exports = router;