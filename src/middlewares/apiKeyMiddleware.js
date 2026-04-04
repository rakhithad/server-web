const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requireApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'Access denied. API Key required.' });
    }

    try {
        const tokenRecord = await prisma.token.findUnique({
            where: { token: apiKey }
        });

        if (!tokenRecord || tokenRecord.type !== 'API_KEY' || tokenRecord.isRevoked || new Date() > tokenRecord.expiresAt) {
            return res.status(403).json({ message: 'Invalid, revoked, or expired API Key.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
};

module.exports = { requireApiKey };