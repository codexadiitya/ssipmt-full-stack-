import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/dashboard')
      .then(r => {
        const subs = r.data.subjects || [];
        setSubjects(subs);
        if (subs.length > 0) setSelectedSubject(subs[0].id);
      })
      .catch(() => toast.error('Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    api.get('/api/faculty/students')
      .then(r => {
        const list = r.data.students || [];
        setStudents(list);
        const init = {};
        list.forEach(s => { init[s._id] = 'present'; });
        setAttendance(init);
      })
      .catch(() => toast.error('Failed to load students'));
  }, [selectedSubject]);

  const markAll = (status) => {
    const next = {};
    students.forEach(s => { next[s._id] = status; });
    setAttendance(next);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'absent' }));
      const date = new Date().toISOString().slice(0, 10);
      await api.post('/api/faculty/attendance', { subjectId: selectedSubject, date, records });
      toast.success('Attendance saved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;

  return (
    <div className="stg" style={{ marginTop: '20px', paddingBottom: '40px' }}>
      <div className="card" style={{ padding: '32px 40px', position: 'relative', paddingBottom: '100px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}>
            <label className="lbl">SUBJECT</label>
            <select 
              className="inp" 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              style={{ background: 'var(--bg)', border: 'none', paddingRight: '40px' }}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          
          <div style={{ 
            display: 'flex', alignItems: 'center', background: '#f5ebfb', padding: '12px 20px', 
            borderRadius: '20px', color: '#a28ef9', border: '1px solid #e5d5f6' 
          }}>
            <span style={{ fontSize: '20px', fontWeight: 900, marginRight: '4px' }}>{presentCount}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.7 }}>/</span>
            <span style={{ fontSize: '20px', fontWeight: 900, marginLeft: '4px', color: 'var(--T)' }}>{students.length}</span>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '12px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--T3)' }}>
              <span>Present</span>
              <span>Total</span>
            </div>
          </div>
        </div>

        {/* Global Toggles */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
           <button 
             onClick={() => markAll('present')}
             style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '24px', border: 'none', background: 'var(--G)', color: 'var(--T)', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
             <span style={{ opacity: 0.5 }}>✓</span> All Present
           </button>
           <button 
             onClick={() => markAll('absent')}
             style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '24px', border: '1px solid #fda4af', background: 'var(--RL)', color: 'var(--R)', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
             <span style={{ opacity: 0.5 }}>✕</span> All Absent
           </button>
        </div>

        {/* Student List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {students.map(s => (
            <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1.5px solid var(--bdr)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--w)', border: '1.5px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: 'var(--P)' }}>
                  {s.name[0]}
                </div>
                <div>
                  <div className="fw8 f14">{s.name}</div>
                  <div className="c3 f11 mt4 fw6">{s.enrollmentNo}</div>
                </div>
              </div>
              <div className="atg" style={{ background: 'var(--bg)', borderRadius: '28px', padding: '6px' }}>
                <button className={`atb${attendance[s._id] === 'present' ? ' P' : ''}`} onClick={() => setAttendance(a => ({ ...a, [s._id]: 'present' }))}>P</button>
                <button className={`atb${attendance[s._id] === 'absent' ? ' A' : ''}`} onClick={() => setAttendance(a => ({ ...a, [s._id]: 'absent' }))}>A</button>
              </div>
            </div>
          ))}
          {students.length === 0 && <div className="c3 f13 fw7 tc mt24">No students found for this subject.</div>}
        </div>

        {/* Sticky Bottom Actions */}
        {students.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 40px', background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1) 40%)', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', display: 'flex' }}>
            <button className="btn btn-p" style={{ padding: '16px 32px', fontSize: '15px' }} onClick={submit} disabled={submitting}>
              {submitting ? <><div className="ld" /> Saving…</> : `✓ Submit — ${presentCount}/${students.length} present`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
