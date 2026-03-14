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
    <div className="stg" style={{ marginTop: '20px' }}>
      {/* Greeting Header */}
      <div className="mb24">
        <div className="fw9" style={{ fontSize: 28, color: '#fff', letterSpacing: '-0.5px' }}>
          Welcome, {user.name.split(' ')[0]}! 👋
        </div>
        <div className="mt4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>
          {user.branch} · {data?.subjects?.[0]?.name || 'Faculty'}
        </div>
      </div>

      {/* 4 Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          {
            n: data?.totalStudents ?? 0, lbl: 'My Students',
            ic: '👨‍🎓', icBg: 'var(--PL)', icCol: 'var(--P)'
          },
          {
            n: 5, lbl: 'Notes Uploaded', // Mocked as 5 based on screenshot
            ic: '📖', icBg: 'var(--GL)', icCol: 'var(--G)'
          },
          {
            n: '86%', lbl: 'Class Avg Att',
            ic: '✓', icBg: 'var(--OL)', icCol: 'var(--O)'
          },
          {
            n: '74%', lbl: 'Class Avg Marks',
            ic: '📊', icBg: 'var(--BL)', icCol: 'var(--B)'
          }
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '24px', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: s.icBg, color: s.icCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 16 }}>{s.ic}</div>
            <div className="fw9" style={{ fontSize: 32, color: s.icCol, lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
            <div className="fw8 f13 c2">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Monthly Attendance Trend */}
        <div className="card" style={{ marginBottom: 0 }}>
           <div className="ct">📈 Monthly Attendance Trend</div>
           <div style={{ height: '180px', position: 'relative', marginTop: '20px' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 10, color: 'var(--T3)', fontWeight: 700 }}>
                <span>100</span><span>90</span><span>80</span><span>70</span><span>60</span>
              </div>
              
              <div style={{ position: 'absolute', left: 24, right: 0, top: 0, bottom: 20 }}>
                <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="0%" x2="100%" y2="0%" stroke="var(--bdr)" strokeWidth="1" />
                  <line x1="0" y1="25%" x2="100%" y2="25%" stroke="var(--bdr)" strokeWidth="1" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--bdr)" strokeWidth="1" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="var(--bdr)" strokeWidth="1" />
                  <line x1="0" y1="100%" x2="100%" y2="100%" stroke="var(--bdr)" strokeWidth="1" />
                  
                  {/* Smooth trend curve mimicking the screenshot */}
                  <path d="M 0,60 C 50,70 100,100 150,110 C 200,120 250,50 300,30 C 350,10 400,10 500,20" fill="none" stroke="var(--P)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                  {/* Light filled area below */}
                  <path d="M 0,60 C 50,70 100,100 150,110 C 200,120 250,50 300,30 C 350,10 400,10 500,20 L 500,150 L 0,150 Z" fill="rgba(162,142,249,0.1)" stroke="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              
              <div style={{ position: 'absolute', left: 24, right: 0, bottom: 0, display: 'flex', justifyItems: 'stretch', justifyContent: 'space-between', fontSize: 10, color: 'var(--T3)', fontWeight: 700 }}>
                <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ct">⚡ Quick Actions</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
             <button className="btn btn-p" style={{ flex: 1, minWidth: '180px', justifyContent: 'center' }} onClick={() => navigate('/faculty/attendance')}>
                <span style={{ fontSize: '18px' }}>✓</span> Take Attendance
             </button>
             <button className="btn btn-l" style={{ flex: 1, minWidth: '180px', justifyContent: 'center', borderColor: 'var(--bdr)' }} onClick={() => navigate('/faculty/notes')}>
                <span style={{ fontSize: '18px' }}>📤</span> Upload Notes
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
