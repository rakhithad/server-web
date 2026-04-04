const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Executing Midnight Winner Selection...');
        
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const winningBid = await prisma.bid.findFirst({
                where: { 
                    targetDate: today, 
                    isWinning: true 
                },
                include: { 
                    user: { include: { profile: true } } 
                }
            });

            await prisma.profile.updateMany({
                where: { isFeaturedToday: true },
                data: { isFeaturedToday: false }
            });

            if (winningBid && winningBid.user.profile) {
                await prisma.profile.update({
                    where: { id: winningBid.user.profile.id },
                    data: { isFeaturedToday: true }
                });
                console.log(`Success: Profile ID ${winningBid.user.profile.id} is now the Alumni of the Day!`);
            } else {
                console.log('No winning bids found for today.');
            }

        } catch (error) {
            console.error('CRON Job Error:', error);
        }
    });

    console.log('Background CRON Jobs initialized.');
};

module.exports = { startCronJobs };