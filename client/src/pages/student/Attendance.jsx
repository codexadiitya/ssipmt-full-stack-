import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const gcol = p => p >= 75 ? '#10b981' : p >= 60 ? '#f59e0b' : '#f43f5e';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/attendance')
      .then(r => setAttendance(r.data.attendance || []))
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={5} />;

  return (
    <div className="stg">
      {attendance.length === 0 ? (
        <div className="card">
          <div className="tc c2 f14 fw6">No attendance records found yet.</div>
        </div>
      ) : attendance.map((item, i) => {
        const pct = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
        return (
          <div key={i} className="card">
            <div className="r jb mb12">
              <div>
                <div className="fw8 f15">{item.subject?.name ?? 'Subject'}</div>
                <div className="c2 f12 mt4">{item.subject?.code}</div>
              </div>
              <div className="fw8 f24" style={{ color: gcol(pct) }}>{pct}%</div>
            </div>
            <div className="pb" style={{ height: 10 }}>
              <div className={`pf ${pct >= 75 ? 'pg' : pct >= 60 ? 'py' : 'pr'}`} style={{ width: pct + '%' }} />
            </div>
            <div className="r jb mt12 f12 c2">
              <span>Present: <b>{item.present}</b></span>
              <span>Total: <b>{item.total}</b></span>
              {pct < 75 && (
                <span className="cr fw7">
                  Need {Math.ceil(0.75 * item.total - item.present)} more
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
