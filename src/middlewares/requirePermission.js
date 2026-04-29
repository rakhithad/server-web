// src/middleware/requirePermission.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];
      
      if (!apiKey) {
        return res.status(401).json({ message: "Access Denied: No API Key provided." });
      }

      const tokenRecord = await prisma.token.findUnique({
        where: { token: apiKey }
      });

      if (!tokenRecord || tokenRecord.type !== 'API_KEY') {
        return res.status(401).json({ message: "Access Denied: Invalid API Key." });
      }

      if (!tokenRecord.permissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          message: `Forbidden: Your key lacks the '${requiredPermission}' permission.` 
        });
      }

      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { 
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      });

      req.apiUser = tokenRecord.userId;
      next();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during authentication." });
    }
  };
};

module.exports = requirePermission;