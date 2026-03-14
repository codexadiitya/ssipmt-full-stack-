import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Already logged in — redirect to the correct dashboard
  if (user) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lw">
      <div className="lcard fu">
        <div className="lic">S</div>
        <div className="tc fw8 f16 mb8">SSIPMT Academic Portal</div>
        <div className="tc c3 f11 mb24" style={{ lineHeight: 1.5 }}>
          Shri Shankaracharya Institute of Professional<br />Management &amp; Technology, Raipur
        </div>
        <form onSubmit={handleSubmit}>
          <div className="fld">
            <label className="lbl">Email</label>
            <input
              className="inp" type="email" required autoComplete="email"
              placeholder="email@ssipmt.ac.in"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="fld">
            <label className="lbl">Password</label>
            <input
              className="inp" type="password" required autoComplete="current-password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-p"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <><div className="ld" /> Signing in…</> : 'Sign In →'}
          </button>
        </form>
        <p className="tc f12 c2 mt16">
          No account? <Link to="/register" style={{ color: 'var(--P)', fontWeight: 800 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
