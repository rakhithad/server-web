// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password
      });
      setMessage('Registration successful! Check your email for the verification link.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2>Admin Registration</h2>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={{color: 'green', marginBottom: '1rem'}}>{message}</p>}
        
        <div style={styles.inputGroup}>
          <label>Email (@eastminster.ac.uk)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        
        <button type="submit" style={styles.button}>Register</button>
        <p style={{marginTop: '1rem', textAlign: 'center'}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '5rem' },
  form: { padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '1rem' },
  input: { padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }
};

export default Register;