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

    static async addCertification(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            const { title, awardingBody, courseUrl, completionDate } = req.body;

            const certification = await prisma.certification.create({
                data: { profileId, title, awardingBody, courseUrl, completionDate: new Date(completionDate) }
            });
            res.status(201).json({ message: 'Certification added', certification });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteCertification(req, res) {
        try {
            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            await prisma.certification.delete({ where: { id: parseInt(req.params.id), profileId } });
            res.status(200).json({ message: 'Certification deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting item' });
        }
    }

    static async addLicence(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            const { title, awardingBody, licenceUrl, completionDate } = req.body;

            const licence = await prisma.licence.create({
                data: { profileId, title, awardingBody, licenceUrl, completionDate: new Date(completionDate) }
            });
            res.status(201).json({ message: 'Licence added', licence });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteLicence(req, res) {
        try {
            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            await prisma.licence.delete({ where: { id: parseInt(req.params.id), profileId } });
            res.status(200).json({ message: 'Licence deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting item' });
        }
    }

    static async addCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            const { title, provider, courseUrl, completionDate } = req.body;

            const course = await prisma.course.create({
                data: { profileId, title, provider, courseUrl, completionDate: new Date(completionDate) }
            });
            res.status(201).json({ message: 'Course added', course });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteCourse(req, res) {
        try {
            const profileId = await PortfolioController.#getProfileId(req.user.userId);
            await prisma.course.delete({ where: { id: parseInt(req.params.id), profileId } });
            res.status(200).json({ message: 'Course deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting item' });
        }
    }


}

module.exports = PortfolioController;