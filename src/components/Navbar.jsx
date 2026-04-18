import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>💰 Expense Tracker</span>
      {user && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/expenses" style={styles.link}>Expenses</Link>
          <span style={styles.name}>Hi, {user.name}</span>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1e293b', color: '#fff' },
  brand: { fontWeight: 'bold', fontSize: '18px' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#94a3b8', textDecoration: 'none' },
  name: { color: '#e2e8f0' },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
};

export default Navbar;
