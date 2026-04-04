const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProfileController {
        static async getMyProfile(req, res) {
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId: req.user.userId },
                include: {
                    degrees: true,
                    certifications: true,
                    licences: true,
                    courses: true,
                    employments: true
                }
            });

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found. Please create one.' });
            }

            res.status(200).json(profile);
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async upsertCoreProfile(req, res) {
        try {
            const { firstName, lastName, biography, linkedInUrl } = req.body;
            const userId = req.user.userId;

            let profileImageUrl = undefined;
            if (req.file) {
                profileImageUrl = `/uploads/profiles/${req.file.filename}`;
            }

            const profile = await prisma.profile.upsert({
                where: { userId: userId },
                update: {
                    firstName,
                    lastName,
                    biography,
                    linkedInUrl,
                    ...(profileImageUrl && { profileImageUrl }) 
                },
                create: {
                    userId,
                    firstName,
                    lastName,
                    biography,
                    linkedInUrl,
                    profileImageUrl
                }
            });

            res.status(200).json({
                message: 'Profile saved successfully',
                profile
            });

        } catch (error) {
            console.error('Upsert Profile Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = ProfileController;