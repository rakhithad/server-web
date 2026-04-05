const express = require('express');
const AuthController = require('../controllers/AuthController');
const { registerValidation, loginValidation, passwordResetRequestValidation, passwordResetValidation } = require('../middlewares/authValidator');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

router.get('/verify-email/:token', AuthController.verifyEmail);

//test
router.get('/me', requireAuth, (req, res) => {
    res.status(200).json({ 
        message: 'You have successfully accessed a protected route!',
        user: req.user 
    });
});

router.post('/request-reset', passwordResetRequestValidation, AuthController.requestPasswordReset);

router.post('/reset-password/:token', passwordResetValidation, AuthController.resetPassword);


router.post('/api-key', requireAuth, AuthController.generateApiKey);
router.post('/revoke-key', requireAuth, AuthController.revokeApiKey);

router.post('/logout', requireAuth, AuthController.logout);



module.exports = router;