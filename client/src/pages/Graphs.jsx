// client/src/pages/Graphs.jsx
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Line, Radar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler);

const Graphs = () => {
  const [loading, setLoading] = useState(true);
  
  const [analyticsData, setAnalyticsData] = useState({
    industries: { labels: ['Tech', 'Finance', 'Healthcare', 'Education', 'Retail'], data: [45, 25, 15, 10, 5] },
    skillsGap: { labels: ['Docker', 'AWS', 'Python', 'Agile', 'React'], data: [75, 60, 80, 55, 90] },
    employmentTrend: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [80, 85, 88, 92, 95] },
    jobTitles: { labels: ['Software Eng', 'Data Analyst', 'Product Mgr', 'Consultant'], data: [120, 80, 45, 30] }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Alumni Insights...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Alumni Data Insights</h1>
        <p>Interactive overview of graduate outcomes, industry placement, and curriculum gaps.</p>
      </div>

      <div style={styles.grid}>
        
        <div style={styles.card}>
          <h3>Employment by Industry Sector</h3>
          <Doughnut 
            data={{
              labels: analyticsData.industries.labels,
              datasets: [{
                data: analyticsData.industries.data,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
              }]
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>

        <div style={styles.card}>
          <h3>Curriculum Skills Gap Analysis</h3>
          <Radar 
            data={{
              labels: analyticsData.skillsGap.labels,
              datasets: [{
                label: '% of Alumni acquiring post-grad',
                data: analyticsData.skillsGap.data,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#ef4444',
                pointBackgroundColor: '#ef4444',
              }]
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>

        <div style={styles.card}>
          <h3>Post-Graduation Employment Rate (%)</h3>
          <Line 
            data={{
              labels: analyticsData.employmentTrend.labels,
              datasets: [{
                label: 'Employment Rate',
                data: analyticsData.employmentTrend.data,
                borderColor: '#10b981',
                tension: 0.3, 
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              }]
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>

        <div style={styles.card}>
          <h3>Most Common Job Titles</h3>
          <Bar 
            data={{
              labels: analyticsData.jobTitles.labels,
              datasets: [{
                label: 'Number of Alumni',
                data: analyticsData.jobTitles.data,
                backgroundColor: '#3b82f6',
              }]
            }}
            options={{ 
              indexAxis: 'y', 
              maintainAspectRatio: false 
            }}
          />
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
    gap: '2rem' 
  },
  card: { 
    backgroundColor: 'white', 
    padding: '1.5rem', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    height: '350px', 
    display: 'flex',
    flexDirection: 'column'
  }
};

export default Graphs;