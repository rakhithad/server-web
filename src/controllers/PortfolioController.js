const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class PortfolioController {
    
    static async #getProfileId(userId) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            throw new Error('You must create a core profile before adding portfolio items.');
        }
        return profile.id;
    }

    // DEGREES
    static async addDegree(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            const { title, institution, universityUrl, completionDate } = req.body;

            const degree = await prisma.degree.create({
                data: {
                    profileId,
                    title,
                    institution,
                    universityUrl,
                    completionDate: new Date(completionDate)
                }
            });

            res.status(201).json({ message: 'Degree added successfully', degree });
        } catch (error) {
            if (error.message.includes('core profile')) return res.status(400).json({ message: error.message });
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteDegree(req, res) {
        try {
            const { id } = req.params;
            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            
            await prisma.degree.delete({
                where: { id: parseInt(id), profileId: profileId }
            });

            res.status(200).json({ message: 'Degree deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting degree or unauthorized' });
        }
    }

    //EMPLOYMENT
    static async addEmployment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            const { jobTitle, company, startDate, endDate } = req.body;

            const employment = await prisma.employmentHistory.create({
                data: {
                    profileId,
                    jobTitle,
                    company,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null 
                }
            });

            res.status(201).json({ message: 'Employment added successfully', employment });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    static async deleteEmployment(req, res) {
        try {
            const { id } = req.params;
            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            
            await prisma.employmentHistory.delete({
                where: { id: parseInt(id), profileId: profileId }
            });

            res.status(200).json({ message: 'Employment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting employment or unauthorized' });
        }
    }
}

module.exports = PortfolioController;