// client/src/pages/Graphs.jsx
import { useState, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Line, Radar, PolarArea } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler);

const Graphs = () => {
  const [filters, setFilters] = useState({ programme: 'All', year: 'All', industry: 'All' });

  const industryRef = useRef(null);
  const skillsRef = useRef(null);
  const employmentRef = useRef(null);
  const jobsRef = useRef(null);
  const geoRef = useRef(null);
  const salaryRef = useRef(null);

  const analyticsData = {
    industries: { labels: ['Tech', 'Finance', 'Healthcare', 'Education', 'Retail'], data: [45, 25, 15, 10, 5] },
    skillsGap: { labels: ['Docker', 'AWS', 'Python', 'Agile', 'React'], data: [75, 60, 80, 55, 90] },
    employmentTrend: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [80, 85, 88, 92, 95] },
    jobTitles: { labels: ['Software Eng', 'Data Analyst', 'Product Mgr', 'Consultant'], data: [120, 80, 45, 30] },
    geography: { labels: ['London', 'Manchester', 'Remote (UK)', 'International'], data: [50, 20, 20, 10] },
    salary: { labels: ['£20k-30k', '£30k-45k', '£45k-60k', '£60k+'], data: [15, 40, 30, 15] }
  };

  const downloadChart = (chartRef, fileName) => {
    const chart = chartRef.current;
    if (chart) {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Alumni Data Insights</h1>
        
        <div style={styles.filterBar}>
          <select style={styles.select} value={filters.programme} onChange={e => setFilters({...filters, programme: e.target.value})}>
            <option value="All">All Programmes</option>
            <option value="CS">Computer Science</option>
            <option value="Business">Business Management</option>
          </select>
          <select style={styles.select} value={filters.year} onChange={e => setFilters({...filters, year: e.target.value})}>
            <option value="All">All Graduation Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <select style={styles.select} value={filters.industry} onChange={e => setFilters({...filters, industry: e.target.value})}>
            <option value="All">All Industries</option>
            <option value="Tech">Technology</option>
            <option value="Finance">Finance</option>
          </select>
          <button style={styles.filterBtn}>Apply Filters</button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Employment by Industry</h3>
            <button onClick={() => downloadChart(industryRef, 'industry_chart')} style={styles.downloadBtn}>💾</button>
          </div>
          <Doughnut ref={industryRef} data={{ labels: analyticsData.industries.labels, datasets: [{ data: analyticsData.industries.data, backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }] }} options={{ maintainAspectRatio: false }} />
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Curriculum Skills Gap</h3>
            <button onClick={() => downloadChart(skillsRef, 'skills_gap_chart')} style={styles.downloadBtn}>💾</button>
          </div>
          <Radar ref={skillsRef} data={{ labels: analyticsData.skillsGap.labels, datasets: [{ label: '% Acquired', data: analyticsData.skillsGap.data, backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' }] }} options={{ maintainAspectRatio: false }} />
        </div>

        <div style={styles.card}>
           <div style={styles.cardHeader}>
            <h3>Employment Trends</h3>
            <button onClick={() => downloadChart(employmentRef, 'employment_trend')} style={styles.downloadBtn}>💾</button>
          </div>
          <Line ref={employmentRef} data={{ labels: analyticsData.employmentTrend.labels, datasets: [{ label: 'Rate %', data: analyticsData.employmentTrend.data, borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)' }] }} options={{ maintainAspectRatio: false }} />
        </div>

        <div style={styles.card}>
           <div style={styles.cardHeader}>
            <h3>Most Common Job Titles</h3>
            <button onClick={() => downloadChart(jobsRef, 'job_titles')} style={styles.downloadBtn}>💾</button>
          </div>
          <Bar ref={jobsRef} data={{ labels: analyticsData.jobTitles.labels, datasets: [{ label: 'Alumni Count', data: analyticsData.jobTitles.data, backgroundColor: '#3b82f6' }] }} options={{ indexAxis: 'y', maintainAspectRatio: false }} />
        </div>

        <div style={styles.card}>
           <div style={styles.cardHeader}>
            <h3>Geographic Distribution</h3>
            <button onClick={() => downloadChart(geoRef, 'geography')} style={styles.downloadBtn}>💾</button>
          </div>
          <Pie ref={geoRef} data={{ labels: analyticsData.geography.labels, datasets: [{ data: analyticsData.geography.data, backgroundColor: ['#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981'] }] }} options={{ maintainAspectRatio: false }} />
        </div>

        <div style={styles.card}>
           <div style={styles.cardHeader}>
            <h3>Starting Salary Brackets</h3>
            <button onClick={() => downloadChart(salaryRef, 'salary_brackets')} style={styles.downloadBtn}>💾</button>
          </div>
          <PolarArea ref={salaryRef} data={{ labels: analyticsData.salary.labels, datasets: [{ data: analyticsData.salary.data, backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(239, 68, 68, 0.5)'] }] }} options={{ maintainAspectRatio: false }} />
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  filterBar: { display: 'flex', gap: '1rem', marginTop: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 },
  filterBtn: { padding: '0.5rem 2rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '350px', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  downloadBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }
};

export default Graphs;