const { Post } = require('../models/post.js');

const ownershipMiddleware = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.authorId !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ownershipMiddleware;