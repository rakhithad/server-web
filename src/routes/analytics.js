const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/AnalyticsController');
const requirePermission = require('../middlewares/requirePermission');

router.get('/dashboard', requirePermission('read:analytics'), getDashboardAnalytics);

module.exports = router;