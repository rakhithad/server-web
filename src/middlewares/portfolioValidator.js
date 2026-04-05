const { body } = require('express-validator');

const degreeValidation = [
    body('title').notEmpty().withMessage('Degree title is required'),
    body('institution').notEmpty().withMessage('Institution is required'),
    body('universityUrl').isURL().withMessage('Must be a valid official university URL'),
    body('completionDate').isISO8601().withMessage('Completion date must be a valid date (YYYY-MM-DD)')
];

const employmentValidation = [
    body('jobTitle').notEmpty().withMessage('Job title is required'),
    body('company').notEmpty().withMessage('Company name is required'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
    body('endDate').optional({ nullable: true }).isISO8601().withMessage('End date must be a valid date')
];

const certificationValidation = [
    body('title').notEmpty().withMessage('Certification title is required'),
    body('awardingBody').notEmpty().withMessage('Awarding body is required'),
    body('courseUrl').isURL().withMessage('Must be a valid course URL'),
    body('completionDate').isISO8601().withMessage('Valid completion date required')
];

const licenceValidation = [
    body('title').notEmpty().withMessage('Licence title is required'),
    body('awardingBody').notEmpty().withMessage('Awarding body is required'),
    body('licenceUrl').isURL().withMessage('Must be a valid licence URL'),
    body('completionDate').isISO8601().withMessage('Valid completion date required')
];

const courseValidation = [
    body('title').notEmpty().withMessage('Course title is required'),
    body('provider').notEmpty().withMessage('Course provider is required'),
    body('courseUrl').isURL().withMessage('Must be a valid course URL'),
    body('completionDate').isISO8601().withMessage('Valid completion date required')
];

module.exports = { degreeValidation, employmentValidation, certificationValidation, licenceValidation, courseValidation };