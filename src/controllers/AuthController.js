const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { generateSecureToken } = require('../utils/tokenGenerator');
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient();

class AuthController {
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'Email is already registered' });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const newUser = await prisma.user.create({
                data: { email, passwordHash }
            });

            const tokenStr = generateSecureToken();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await prisma.token.create({
                data: {
                    userId: newUser.id,
                    token: tokenStr,
                    type: 'EMAIL_VERIFY',
                    expiresAt: expiresAt
                }
            });

            res.status(201).json({
                message: 'User registered successfully. Pending email verification.',
                userId: newUser.id,
                mockVerificationUrl: `http://localhost:3000/api/auth/verify-email/${tokenStr}`
            });

        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }



    static async verifyEmail(req, res) {
        try {
            const { token } = req.params;

            const tokenRecord = await prisma.token.findUnique({
                where: { token }
            });

            if (!tokenRecord || tokenRecord.type !== 'EMAIL_VERIFY' || tokenRecord.isRevoked) {
                return res.status(400).json({ message: 'Invalid or revoked verification token' });
            }

            if (new Date() > tokenRecord.expiresAt) {
                return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
            }

            await prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { isEmailVerified: true }
            });

            await prisma.token.delete({
                where: { id: tokenRecord.id }
            });

            res.status(200).json({ message: 'Email successfully verified. You can now log in.' });

        } catch (error) {
            console.error('Verification Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (!user.isEmailVerified) {
                return res.status(403).json({ message: 'Please verify your email before logging in.' });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token: token,
                expiresIn: '1h'
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static async requestPasswordReset(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
            }

            const tokenStr = generateSecureToken(); 
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

            await prisma.token.updateMany({
                where: { userId: user.id, type: 'RESET_PASSWORD', isRevoked: false },
                data: { isRevoked: true }
            });

            await prisma.token.create({
                data: {
                    userId: user.id,
                    token: tokenStr,
                    type: 'RESET_PASSWORD',
                    expiresAt: expiresAt
                }
            });

            res.status(200).json({
                message: 'If that email is registered, a reset link has been sent.',
                mockResetUrl: `http://localhost:3000/api/auth/reset-password/${tokenStr}`
            });

        } catch (error) {
            console.error('Password Reset Request Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resetPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { token } = req.params;
            const { password } = req.body;

            // 1. Find the token
            const tokenRecord = await prisma.token.findUnique({ where: { token } });

            // 2. Validate token
            if (!tokenRecord || tokenRecord.type !== 'RESET_PASSWORD' || tokenRecord.isRevoked) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            if (new Date() > tokenRecord.expiresAt) {
                return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
            }

            // 3. Hash the new password
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(password, saltRounds);

            // 4. Update the user
            await prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { passwordHash: newPasswordHash }
            });

            // 5. Delete the used token
            await prisma.token.delete({ where: { id: tokenRecord.id } });

            res.status(200).json({ message: 'Password has been successfully reset. You can now log in.' });

        } catch (error) {
            console.error('Password Reset Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = AuthController;