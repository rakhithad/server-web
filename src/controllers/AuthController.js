const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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
                data: { isVerified: true }
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
}

module.exports = AuthController;