const { body } = require('express-validator');

const registerValidation = [
    body('email')
        .isEmail().withMessage('Must be a valid email address')
        .custom(value => {
            if (!value.endsWith('@eastminster.ac.uk')) {
                throw new Error('Must use a valid University of Eastminster email address');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
];


const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

const passwordResetRequestValidation = [
    body('email').isEmail().withMessage('Please provide a valid email')
];

const passwordResetValidation = [
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
];


module.exports = { registerValidation, loginValidation, passwordResetRequestValidation, passwordResetValidation };