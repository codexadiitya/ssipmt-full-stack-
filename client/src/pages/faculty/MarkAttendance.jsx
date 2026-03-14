import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/dashboard')
      .then(r => {
        setSubjects(r.data.subjects || []);
        if (r.data.subjects?.length) setSelectedSubject(r.data.subjects[0].id);
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

  const toggle = (id) => setAttendance(a => ({
    ...a,
    [id]: a[id] === 'present' ? 'absent' : 'present',
  }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'absent' }));
      await api.post('/api/faculty/attendance', { subjectId: selectedSubject, date, records });
      toast.success('Attendance saved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div>
      <div className="card">
        <div className="ct">📋 Mark Attendance</div>
        <div className="g2 mb20">
          <div className="fld">
            <label className="lbl">Subject</label>
            <select className="inp" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>)}
            </select>
          </div>
          <div className="fld">
            <label className="lbl">Date</label>
            <input className="inp" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="r jb mb16">
          <span className="f13 c2 fw6">{students.length} students</span>
          <span className="f13 fw7 cp">
            {Object.values(attendance).filter(v => v === 'present').length} present
          </span>
        </div>

        {students.map(s => (
          <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--bdr)' }}>
            <div>
              <div className="fw7 f14">{s.name}</div>
              <div className="c2 f12 mt4">{s.enrollmentNo}</div>
            </div>
            <div className="atg">
              <button className={`atb${attendance[s._id] === 'present' ? ' P' : ''}`} onClick={() => setAttendance(a => ({ ...a, [s._id]: 'present' }))}>P</button>
              <button className={`atb${attendance[s._id] === 'absent' ? ' A' : ''}`} onClick={() => setAttendance(a => ({ ...a, [s._id]: 'absent' }))}>A</button>
            </div>
          </div>
        ))}

        {students.length > 0 && (
          <button className="btn btn-p mt20" style={{ width: '100%', justifyContent: 'center' }} onClick={submit} disabled={submitting}>
            {submitting ? <><div className="ld" /> Saving…</> : '✓ Save Attendance'}
          </button>
        )}
      </div>
    </div>
  );
}
