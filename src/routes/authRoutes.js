const express = require('express');
const AuthController = require('../controllers/AuthController');
const { registerValidation } = require('../middlewares/authValidator');

const router = express.Router();

router.post('/register', registerValidation, AuthController.register);

router.get('/verify-email/:token', AuthController.verifyEmail);

module.exports = router;