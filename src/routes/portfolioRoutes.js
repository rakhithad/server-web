const express = require('express');
const PortfolioController = require('../controllers/PortfolioController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { degreeValidation, employmentValidation } = require('../middlewares/portfolioValidator');

const router = express.Router();

router.use(requireAuth);

// Degree Routes
router.post('/degree', degreeValidation, PortfolioController.addDegree);
router.delete('/degree/:id', PortfolioController.deleteDegree);

// Employment Routes
router.post('/employment', employmentValidation, PortfolioController.addEmployment);
router.delete('/employment/:id', PortfolioController.deleteEmployment);

module.exports = router;