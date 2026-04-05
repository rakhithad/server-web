// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const isBlacklisted = await prisma.token.findFirst({
            where: { token: token, type: 'BLACKLIST' }
        });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Session logged out. Please log in again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { requireAuth };