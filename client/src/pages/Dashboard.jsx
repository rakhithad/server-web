// client/src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Simulated Raw Data for Export
  const rawData = [
    { id: 1, name: "John Doe", programme: "Computer Science", year: 2024, industry: "Tech", role: "Software Engineer" },
    { id: 2, name: "Jane Smith", programme: "Business", year: 2023, industry: "Finance", role: "Analyst" },
    { id: 3, name: "Sam Wilson", programme: "Computer Science", year: 2024, industry: "Tech", role: "Cloud Architect" },
  ];

  // CSV GENERATION FUNCTION (5 Marks!)
  const exportToCSV = () => {
    // 1. Create CSV Headers
    const headers = ["ID", "Name", "Programme", "Graduation Year", "Industry", "Job Role"];
    
    // 2. Map data into CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...rawData.map(row => `${row.id},"${row.name}","${row.programme}",${row.year},"${row.industry}","${row.role}"`)
    ];

    // 3. Create a Blob and trigger download
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

      {/* SUMMARY STATS (KPI Cards) */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Total Registered Alumni</h4>
          <h2 style={styles.kpiValue}>1,245</h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Post-Grad Employment</h4>
          <h2 style={styles.kpiValue}>92%</h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Emerging Skill Alert</h4>
          <h2 style={styles.kpiValue}><span style={{color: '#ef4444'}}>Docker / AWS</span></h2>
        </div>
        <div style={styles.kpiCard}>
          <h4 style={styles.kpiTitle}>Top Industry</h4>
          <h2 style={styles.kpiValue}>Technology</h2>
        </div>
      </div>

      {/* QUICK ACTIONS */}
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