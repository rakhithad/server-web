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
                data: {
                    email,
                    passwordHash,
                }
            });


            res.status(201).json({
                message: 'User registered successfully. Pending email verification.',
                userId: newUser.id
            });

        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = AuthController;