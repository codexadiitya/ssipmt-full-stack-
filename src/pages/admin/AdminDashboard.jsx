import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={4} />;

  const stats = [
    { n: data?.totalStudents ?? 0, lbl: 'Students', color: 'var(--P)', bg: 'var(--PL)', icon: '🎓', onClick: () => navigate('/admin/students') },
    { n: data?.totalFaculty ?? 0, lbl: 'Faculty', color: 'var(--G)', bg: 'var(--GL)', icon: '👩‍🏫' },
    { n: data?.totalNotices ?? 0, lbl: 'Notices', color: 'var(--O)', bg: 'var(--OL)', icon: '🔔', onClick: () => navigate('/admin/notices') },
    { n: data?.totalSubjects ?? 0, lbl: 'Subjects', color: 'var(--B)', bg: 'var(--BL)', icon: '📚' },
    { n: 'CSV', lbl: 'Reports', color: 'var(--R)', bg: 'var(--RL)', icon: '📊', onClick: () => navigate('/admin/reports') },
  ];

  return (
    <div className="stg">
      <div className="sg">
        {stats.map((s, i) => (
          <div key={i} className="st" onClick={s.onClick} style={{ borderTop: `3px solid ${s.color}`, cursor: s.onClick ? 'pointer' : 'default' }}>
            <div className="st-ic" style={{ background: s.bg, fontSize: 24 }}>{s.icon}</div>
            <div className="st-n" style={{ color: s.color }}>{s.n}</div>
            <div className="st-l">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="ct">👥 Recent Users</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentUsers?.map((u, i) => (
                <tr key={i}>
                  <td className="fw7">{u.name}</td>
                  <td className="c2 f12">{u.email}</td>
                  <td><span className={`bd f11 ${u.role === 'admin' ? 'br' : u.role === 'faculty' ? 'bp' : 'bg'}`}>{u.role}</span></td>
                  <td>{u.branch || '-'}</td>
                  <td className="c2 f12">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
