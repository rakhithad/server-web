const express = require('express');
const PublicController = require('../controllers/PublicController');
const { requireApiKey } = require('../middlewares/apiKeyMiddleware');

const router = express.Router();

router.get('/featured', requireApiKey, PublicController.getFeaturedAlumnus);

module.exports = router;