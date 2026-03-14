import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    enrollmentNo: '', branch: 'CSE', semester: 1, phone: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, semester: Number(form.semester) };
      if (form.role !== 'student') { delete payload.enrollmentNo; delete payload.semester; }
      const user = await register(payload);
      toast.success('Account created!');
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lw">
      <div className="lcard fu" style={{ maxWidth: 540 }}>
        <div className="lic">S</div>
        <div className="tc fw8 f16 mb24">Create Account</div>
        <form onSubmit={handleSubmit}>
          <div className="g2">
            <div className="fld">
              <label className="lbl">Full Name</label>
              <input className="inp" required placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
            </div>
            <div className="fld">
              <label className="lbl">Role</label>
              <select className="inp" value={form.role} onChange={set('role')}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="fld">
            <label className="lbl">Email</label>
            <input className="inp" type="email" required placeholder="email@ssipmt.ac.in" value={form.email} onChange={set('email')} />
          </div>
          <div className="fld">
            <label className="lbl">Password</label>
            <input className="inp" type="password" required minLength={8} placeholder="Min 8 characters" value={form.password} onChange={set('password')} />
          </div>
          <div className="g2">
            <div className="fld">
              <label className="lbl">Branch</label>
              <select className="inp" value={form.branch} onChange={set('branch')}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            {form.role === 'student' && (
              <div className="fld">
                <label className="lbl">Semester</label>
                <select className="inp" value={form.semester} onChange={set('semester')}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            )}
          </div>
          {form.role === 'student' && (
            <div className="fld">
              <label className="lbl">Enrollment No</label>
              <input className="inp" required placeholder="CSE21001" value={form.enrollmentNo} onChange={set('enrollmentNo')} />
            </div>
          )}
          <div className="fld">
            <label className="lbl">Phone (optional)</label>
            <input className="inp" type="tel" placeholder="10-digit number" value={form.phone} onChange={set('phone')} />
          </div>
          <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <><div className="ld" /> Creating account…</> : 'Create Account →'}
          </button>
        </form>
        <p className="tc f12 c2 mt16">
          Already have an account? <Link to="/login" style={{ color: 'var(--P)', fontWeight: 800 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
