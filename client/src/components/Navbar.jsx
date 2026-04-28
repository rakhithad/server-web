// client/src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Phantasmagoria Analytics</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard Home</Link>
        <Link to="/graphs" style={styles.link}>Alumni Insights</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e293b',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  logo: { margin: 0, fontSize: '1.5rem' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' }
};

export default Navbar;