const express = require('express');
const BidController = require('../controllers/BidController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { bidValidation } = require('../middlewares/bidValidator');

const router = express.Router();

router.use(requireAuth);

router.post('/', bidValidation, BidController.placeOrUpdateBid);

module.exports = router;