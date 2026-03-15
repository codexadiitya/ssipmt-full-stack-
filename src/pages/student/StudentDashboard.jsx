import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CC = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
const gcol = p => p >= 75 ? '#10b981' : p >= 60 ? '#f59e0b' : '#f43f5e';

function Pb({ v, cls = 'pp' }) {
  return <div className="pb"><div className={`pf ${cls}`} style={{ width: v + '%' }} /></div>;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={4} />;

  const daysLeft = Math.max(0, Math.ceil((new Date('2026-03-15') - new Date()) / 86400000));

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      
      {/* Greeting Header */}
      <div className="r jb w g8 mb24">
        <div>
          <div className="fw9" style={{ fontSize: 28, color: '#fff', letterSpacing: '-0.5px' }}>
            Good morning, {user.name.split(' ')[0]}! 👋
          </div>
          <div className="mt4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>
            {user.branch} · Sem {user.semester} · Sec A ·
          </div>
        </div>
        <div style={{ background: '#ffe4e6', border: 'none', borderRadius: 16, padding: '14px 24px', textAlign: 'center', minWidth: 90, boxShadow: '0 8px 24px rgba(244,63,94,0.15)' }}>
          <div className="fw9 cr" style={{ fontSize: 28, lineHeight: 1 }}>{daysLeft}</div>
          <div className="cr f10 fw8 mt4" style={{ letterSpacing: 1, textTransform: 'uppercase' }}>DAYS TO EXAM</div>
        </div>
      </div>

      {/* 6 Top Stats Cards */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', margin: '0 -24px 24px', paddingLeft: '24px', scrollSnapType: 'x mandatory' }}>
        {[
          {
            n: `${data?.attendancePercentage ?? '85'}%`, lbl: 'Avg Attendance', sub: '0 below 75 %', 
            pill: '↑ This month', pillCol: 'var(--G)', 
            ic: '✓', icBg: '#f5ebfb', icCol: '#a28ef9'
          },
          {
            n: `81%`, lbl: 'Avg Marks', sub: '5 subjects', 
            pill: 'Mid-sem done', pillCol: 'var(--G)', 
            ic: '📊', icBg: '#e8fdf0', icCol: '#10b981'
          },
          {
            n: data?.notices?.length ?? 4, lbl: 'Notices', sub: '1 important', 
            pill: '2 unread', pillCol: 'var(--R)', 
            ic: '🔔', icBg: '#fff3e3', icCol: '#f59e0b'
          },
          {
            n: 5, lbl: 'Study Notes', sub: 'Available', 
            pill: '2 new', pillCol: 'var(--G)', 
            ic: '📖', icBg: '#dbeafe', icCol: '#3b82f6'
          },
          {
            n: 6, lbl: 'PYQ Papers', sub: 'Verified', 
            pill: 'View all', pillCol: 'var(--T3)', 
            ic: '📁', icBg: '#f5ebfb', icCol: '#a28ef9'
          },
          {
            n: 3, lbl: 'Pending Tasks', sub: 'Study planner', 
            pill: 'Due soon', pillCol: 'var(--R)', 
            ic: '✅', icBg: '#ffe4e6', icCol: '#f43f5e'
          }
        ].map((s, i) => (
          <div key={i} className="card" style={{ flex: '0 0 160px', padding: '24px', marginBottom: 0, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: s.icBg, color: s.icCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 16 }}>{s.ic}</div>
            <div className="fw9" style={{ fontSize: 32, color: s.icCol, lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
            <div className="fw8 f13 c2">{s.lbl}</div>
            <div className="f11 c3 fw6 mt4 mb16">{s.sub}</div>
            <div style={{ marginTop: 'auto', textAlign: 'center', padding: '8px', borderRadius: 12, border: `1.5px dashed ${s.icBg}`, color: s.pillCol, fontSize: 12, fontWeight: 800 }}>
              {s.pill}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Subject Performance Box */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ct">📊 Subject Performance</div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8%', padding: '20px 0 0 30px', position: 'relative' }}>
             {/* Y-axis labels */}
             <div style={{ position: 'absolute', left: 0, top: 10, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 10, color: 'var(--T3)', fontWeight: 700 }}>
               <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
             </div>
             {/* Grid lines */}
             {[0, 25, 50, 75, 100].map(v => (
               <div key={v} style={{ position: 'absolute', left: 24, right: 0, bottom: `${v}%`, height: 1, background: 'var(--bdr)', zIndex: 0 }} />
             ))}

             {/* Bars */}
             {data?.latestResult ? data.latestResult.marks.map((m, i) => {
               const v = Math.round(((m.internal + m.external) / 100) * 100);
               const c = CC[i % CC.length];
               return (
                 <div key={m._id || i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, height: '100%' }}>
                   <div style={{ width: '100%', maxWidth: 24, background: c, height: `${v}%`, borderRadius: '6px 6px 0 0', marginTop: 'auto', transition: 'height 1s cubic-bezier(0.16,1,0.3,1)' }} />
                   <div style={{ fontSize: 10, color: 'var(--T2)', fontWeight: 700, marginTop: 12, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                     {m.subject?.code || `Sub ${i+1}`}
                   </div>
                 </div>
               );
             }) : (
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--T3)', fontSize: 13, fontWeight: 700, zIndex: 2 }}>
                 No result data available
               </div>
             )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ct">✓ Attendance Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data?.subjectwiseAttendance ? data.subjectwiseAttendance.map((s, i) => (
              <div key={i}>
                <div className="r jb mb8">
                  <span className="fw7 f12 c2">{s.name}</span>
                  <span className="fw8 f12" style={{ color: gcol(s.percentage) }}>{s.percentage}%</span>
                </div>
                <div className="pb" style={{ height: 6, background: 'var(--GL)', border: 'none' }}><div className="pf" style={{ width: s.percentage + '%', background: gcol(s.percentage), borderRadius: 6 }} /></div>
              </div>
            )) : (
              <div className="c3 f13 fw7 tc mt12">No attendance records found.</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Today's Classes */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="r jb mb24">
            <div className="ct" style={{ marginBottom: 0 }}>📅 Today's Classes</div>
            <div className="bd" style={{ background: '#a28ef9', color: '#fff', fontSize: 11 }}>Thursday</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { t: '9:00 AM', s: 'OS', l: 'LH-2' },
              { t: '10:00 AM', s: 'Data Structures', l: 'LH-1' },
              { t: '11:00 AM', s: 'DBMS (Tutorial)', l: 'Lab-3', act: true },
              { t: '12:00 PM', s: 'CN', l: 'LH-3' }
            ].map((c, i) => (
              <div key={i} className="r" style={{ padding: '16px 20px', background: c.act ? '#ffd89d' : 'var(--bg)', borderRadius: 24, gap: 16 }}>
                <div className="fw8 f11" style={{ color: c.act ? '#d97706' : '#a28ef9', width: 60, whiteSpace: 'nowrap' }}>{c.t}</div>
                <div style={{ flex: 1 }}>
                  <div className="fw8 f14" style={{ color: c.act ? '#78350f' : 'var(--T)' }}>{c.s}</div>
                  <div className="fw6 f11" style={{ color: c.act ? 'rgba(120,53,15,0.7)' : 'var(--T3)', marginTop: 4 }}>LH-{i+1}</div>
                </div>
                {!c.act && <div className="bd" style={{ background: '#e2e8f0', color: 'var(--T2)' }}>LH-{i+1}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Latest Notices */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ct">🔔 Latest Notices</div>
          {data?.notices?.length === 0 && <div className="c2 f13">No notices yet.</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.notices?.map((n) => {
              const cat = n.category || 'General';
              const cType = cat.toLowerCase() === 'exam' ? 'Exam' : cat.toLowerCase() === 'event' ? 'Event' : 'General';
              return (
                <div key={n._id} className="r jb" style={{ background: 'var(--w)', border: '1px solid var(--bdr)', borderLeft: '6px solid ' + (cType === 'Exam' ? 'var(--R)' : cType === 'Event' ? 'var(--P)' : 'var(--O)'), borderRadius: 24, padding: '20px 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div>
                    <div className="fw8 f13 mb6">{n.title}</div>
                    <div className="f10 fw6 c3">{new Date(n.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="bd" style={{ background: cType === 'Exam' ? 'var(--RL)' : cType === 'Event' ? 'var(--P)' : 'var(--O)', color: cType === 'Exam' ? 'var(--R)' : cType === 'Event' ? 'var(--w)' : 'var(--T)' }}>{cat}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
