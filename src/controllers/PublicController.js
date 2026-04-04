const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PublicController {
    
    static async getFeaturedAlumnus(req, res) {
        try {
            const featuredProfile = await prisma.profile.findFirst({
                where: { isFeaturedToday: true },
                include: {
                    degrees: true,
                    certifications: true,
                    licences: true,
                    courses: true,
                    employments: true,
                    user: {
                        select: { email: true } 
                    }
                }
            });

            if (!featuredProfile) {
                return res.status(404).json({ message: 'No Alumni featured today.' });
            }

            res.status(200).json({
                message: 'Featured Alumni retrieved successfully',
                data: featuredProfile
            });

        } catch (error) {
            console.error('Public API Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = PublicController;