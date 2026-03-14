import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/faculty/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="stg">
      <div className="fw8 mb16" style={{ fontSize: 22, color: 'var(--T)' }}>
        Good morning, {user.name.split(' ')[0]}! 👋
        <div className="c2 f13 mt6 fw5">{user.branch} Department</div>
      </div>

      <div className="sg">
        {[
          { n: data?.totalSubjects ?? 0, lbl: 'My Subjects', color: 'var(--P)', bg: 'var(--PL)', icon: '📚', onClick: () => navigate('/faculty/attendance') },
          { n: data?.totalStudents ?? 0, lbl: 'Students', color: 'var(--G)', bg: 'var(--GL)', icon: '🎓' },
          { n: data?.markedToday ?? 0, lbl: 'Marked Today', color: 'var(--O)', bg: 'var(--OL)', icon: '✓' },
          { n: data?.notices?.length ?? 0, lbl: 'Notices', color: 'var(--B)', bg: 'var(--BL)', icon: '🔔' },
        ].map((s, i) => (
          <div key={i} className="st" onClick={s.onClick} style={{ borderTop: `3px solid ${s.color}`, cursor: s.onClick ? 'pointer' : 'default' }}>
            <div className="st-ic" style={{ background: s.bg, fontSize: 24 }}>{s.icon}</div>
            <div className="st-n" style={{ color: s.color }}>{s.n}</div>
            <div className="st-l">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="ct">📚 My Subjects</div>
        {data?.subjects?.length === 0 && <div className="c2 f13">No subjects assigned yet.</div>}
        {data?.subjects?.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--bdr)' }}>
            <div>
              <div className="fw7 f14">{s.name}</div>
              <div className="c2 f12 mt4">{s.code} · Sem {s.semester}</div>
            </div>
            <button className="btn btn-sm btn-l" onClick={() => navigate('/faculty/attendance')}>
              Take Attendance
            </button>
          </div>
        ))}
      </div>

      {data?.notices?.length > 0 && (
        <div className="card">
          <div className="ct">🔔 Latest Notices</div>
          {data.notices.map((n, i) => (
            <div key={i} className={`nc ${(n.category || 'general').toLowerCase()}`}>
              <div className="fw7 f13">{n.title}</div>
              <div className="c2 f11 mt4">{new Date(n.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
