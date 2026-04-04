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

module.exports = { degreeValidation, employmentValidation };