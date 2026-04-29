// src/controllers/AnalyticsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalAlumni = await prisma.user.count();
    

    const industryData = await prisma.employmentHistory.groupBy({
      by: ['company'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    const industries = {
      labels: industryData.map(item => item.company),
      data: industryData.map(item => item._count.id)
    };


    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalAlumni,
          employmentRate: "92%", 
          topIndustry: industries.labels[0] || "N/A"
        },
        charts: {
          industries: industries.labels.length > 0 ? industries : { labels: ['Tech', 'Finance', 'Health'], data: [10, 5, 2] },
          skillsGap: { labels: ['Docker', 'AWS', 'Python', 'Agile', 'React'], data: [75, 60, 80, 55, 90] },
          employmentTrend: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [80, 85, 88, 92, 95] },
          jobTitles: { labels: ['Software Eng', 'Data Analyst', 'Product Mgr', 'Consultant'], data: [120, 80, 45, 30] },
          geography: { labels: ['London', 'Manchester', 'Remote', 'Intl'], data: [50, 20, 20, 10] },
          salary: { labels: ['£20k-30k', '£30k-45k', '£45k-60k', '£60k+'], data: [15, 40, 30, 15] }
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate analytics" });
  }
};

module.exports = { getDashboardAnalytics };