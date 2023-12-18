const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const secretKey = process.env.SECRET_KEY;
    const options = { expiresIn: '1d' };

    return jwt.sign(payload, secretKey, options);
};

const authController = {
    register: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, password: hashedPassword, email });

            const token = generateToken(user);

            return res.status(201).json({ token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(user);

            return res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = authController;
