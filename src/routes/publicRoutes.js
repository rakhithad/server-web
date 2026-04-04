const express = require('express');
const PublicController = require('../controllers/PublicController');
const { requireApiKey } = require('../middlewares/apiKeyMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/public/featured:
 *   get:
 *     summary: Retrieves the Alumni Influencer of the Day
 *     description: Used by the AR client to fetch today's winning alumni profile.
 *     tags:
 *       - Public AR Client
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the featured profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "alumni_123"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 image:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 title:
 *                   type: string
 *                   example: "Software Engineer"
 *       401:
 *         description: Missing API Key
 *       403:
 *         description: Invalid API Key
 *       404:
 *         description: No Alumni featured today
 */
router.get('/featured', requireApiKey, PublicController.getFeaturedAlumnus);

module.exports = router;