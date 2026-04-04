const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class BidController {
    static async #checkMonthlyLimit(userId, targetDate) {
        const date = new Date(targetDate);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const winningBidsCount = await prisma.bid.count({
            where: {
                userId: userId,
                isWinning: true,
                targetDate: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        if (winningBidsCount >= 3) {
            throw new Error('Monthly limit reached. You can only be featured 3 times per calendar month.');
        }
    }

    static async #recalculateWinner(targetDate) {
        await prisma.bid.updateMany({
            where: { targetDate: new Date(targetDate) },
            data: { isWinning: false }
        });

        const highestBid = await prisma.bid.findFirst({
            where: { targetDate: new Date(targetDate) },
            orderBy: { amount: 'desc' }
        });

        if (highestBid) {
            await prisma.bid.update({
                where: { id: highestBid.id },
                data: { isWinning: true }
            });
        }
    }

    static async placeOrUpdateBid(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { amount, targetDate } = req.body;
            const userId = req.user.userId;
            const formattedDate = new Date(targetDate);

            try {
                await BidController.#checkMonthlyLimit(userId, formattedDate);
            } catch (limitError) {
                return res.status(403).json({ message: limitError.message });
            }

            const existingBid = await prisma.bid.findUnique({
                where: {
                    userId_targetDate: { userId: userId, targetDate: formattedDate }
                }
            });

            let savedBid;

            if (existingBid) {
                if (amount <= existingBid.amount) {
                    return res.status(400).json({ 
                        message: `Bid update failed. New amount must be higher than your current bid of £${existingBid.amount}` 
                    });
                }

                savedBid = await prisma.bid.update({
                    where: { id: existingBid.id },
                    data: { amount: amount }
                });
            } else {
                savedBid = await prisma.bid.create({
                    data: {
                        userId: userId,
                        amount: amount,
                        targetDate: formattedDate
                    }
                });
            }

            await BidController.#recalculateWinner(formattedDate);

            res.status(200).json({ 
                message: existingBid ? 'Bid updated successfully' : 'Bid placed successfully', 
                bid: savedBid 
            });

        } catch (error) {
            console.error('Bidding Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = BidController;