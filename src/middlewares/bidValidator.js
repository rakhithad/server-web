const { body } = require('express-validator');

const bidValidation = [
    body('amount')
        .isFloat({ gt: 0 }).withMessage('Bid amount must be greater than 0'),
    body('targetDate')
        .isISO8601().withMessage('Target date must be a valid date (YYYY-MM-DD)')
        .custom(value => {
            const target = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            
            if (target <= today) {
                throw new Error('Target date must be in the future');
            }
            return true;
        })
];

module.exports = { bidValidation };