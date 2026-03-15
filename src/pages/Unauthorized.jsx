import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();
  const home = user?.role === 'student'
    ? '/student/dashboard'
    : user?.role === 'faculty'
    ? '/faculty/dashboard'
    : '/admin/dashboard';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24, textAlign: 'center',
    }}>
      <div style={{ fontSize: 72 }}>🔒</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: '16px 0 8px' }}>Access Denied</h1>
      <p style={{ color: 'var(--T2)', marginBottom: 32 }}>
        You don't have permission to view this page.
      </p>
      <Link to={home} className="btn btn-p">← Go to Dashboard</Link>
    </div>
  );
}
