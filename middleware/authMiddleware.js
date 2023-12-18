const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const secretKey = process.env.SECRET_KEY;
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - Token missing' });
        }

        // Check for the "Bearer " prefix in the token
        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        jwt.verify(tokenParts[1], secretKey, (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(401).json({ error: 'Invalid token' });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
