const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(user) {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
}

async function authenticate(token) {
    if (!token) return null;

    try {
        const { id } = jwt.verify(token.split(' ')[1], JWT_SECRET);

        return await User.findByPk(id);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, authenticate, JWT_SECRET };