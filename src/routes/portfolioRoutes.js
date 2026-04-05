const express = require('express');
const PortfolioController = require('../controllers/PortfolioController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { degreeValidation, employmentValidation, certificationValidation, licenceValidation, courseValidation } = require('../middlewares/portfolioValidator');

const router = express.Router();

router.use(requireAuth);

// Degree Routes
router.post('/degree', degreeValidation, PortfolioController.addDegree);
router.delete('/degree/:id', PortfolioController.deleteDegree);

// Employment Routes
router.post('/employment', employmentValidation, PortfolioController.addEmployment);
router.delete('/employment/:id', PortfolioController.deleteEmployment);

router.post('/certification', certificationValidation, PortfolioController.addCertification);
router.delete('/certification/:id', PortfolioController.deleteCertification);

router.post('/licence', licenceValidation, PortfolioController.addLicence);
router.delete('/licence/:id', PortfolioController.deleteLicence);

router.post('/course', courseValidation, PortfolioController.addCourse);
router.delete('/course/:id', PortfolioController.deleteCourse);

module.exports = router;