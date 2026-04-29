// client/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/analytics/dashboard', {
          headers: {
            'x-api-key': 'ak_dashboard_12345'
          }
        });
        setKpis(response.data.data.kpis);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Programme", "Graduation Year", "Industry", "Job Role"];
    const rawData = [
      { id: 1, name: "System User", programme: "Computer Science", year: 2024, industry: kpis?.topIndustry || "Tech", role: "Software Engineer" }
    ];
    
    const csvRows = [
      headers.join(','),
      ...rawData.map(row => `${row.id},"${row.name}","${row.programme}",${row.year},"${row.industry}","${row.role}"`)
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'phantasmagoria_alumni_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{margin: 0}}>University Intelligence Dashboard</h1>
          <p style={{color: '#64748b', marginTop: '0.5rem'}}>Overview of real-time alumni outcomes.</p>
        </div>
        <button onClick={exportToCSV} style={styles.exportBtn}>
          📊 Export Raw Data (CSV)
        </button>
      </div>

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Total Registered Alumni</h4>
          <h2 style={styles.kpiValue}>{kpis?.totalAlumni || 0}</h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Post-Grad Employment</h4>
          <h2 style={styles.kpiValue}>{kpis?.employmentRate || "N/A"}</h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Emerging Skill Alert</h4>
          <h2 style={styles.kpiValue}><span style={{color: '#ef4444'}}>Docker / AWS</span></h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Top Industry</h4>
          <h2 style={styles.kpiValue}>{kpis?.topIndustry || "Technology"}</h2>
        </div>
      </div>

      <div style={styles.actionPanel}>
        <h3>Strategic Insights Required</h3>
        <p>Curriculum gaps have been detected in the Computer Science department regarding Cloud Infrastructure.</p>
        <Link to="/graphs" style={styles.linkBtn}>View Detailed Charts →</Link>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  exportBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  kpiCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #3b82f6' },
  kpiTitle: { margin: 0, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' },
  kpiValue: { margin: '0.5rem 0 0 0', fontSize: '2rem', color: '#0f172a' },
  actionPanel: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  linkBtn: { display: 'inline-block', marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }
};

export default Dashboard;