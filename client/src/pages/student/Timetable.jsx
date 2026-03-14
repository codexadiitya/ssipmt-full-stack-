import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Timetable() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayName = DAYS[Math.min(new Date().getDay() - 1, 5)] || 'Monday';
  const [day, setDay] = useState(todayName);

  useEffect(() => {
    api.get('/api/student/timetable')
      .then(r => setSlots(r.data.timetable || []))
      .catch(() => toast.error('Failed to load timetable'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={4} />;

  const daySlots = slots.filter(s => s.day === day);

  return (
    <div>
      {/* Day selector */}
      <div className="date-row">
        {DAYS.map(d => (
          <div
            key={d}
            className={`date-pill${day === d ? ' on' : ''}`}
            onClick={() => setDay(d)}
          >
            <div className="d-day">{d.slice(0, 3)}</div>
            <div className="d-num">{d.slice(0, 1)}</div>
          </div>
        ))}
      </div>

      {daySlots.length === 0 ? (
        <div className="card tc c2 f14 fw6">No classes on {day}</div>
      ) : daySlots.map((s, i) => (
        <div key={i} className="tsl">
          <div className="r jb" style={{ width: '100%' }}>
            <div className="r g10">
              <span className="fw7 f11 cp" style={{ minWidth: 52 }}>{s.startTime}</span>
              <div>
                <div className="fw7 f13">{s.subjectName}</div>
                <div className="c2 f11 mt4">{s.subjectCode} · {s.faculty}</div>
              </div>
            </div>
            {s.room && <span className="bd bz">{s.room}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
