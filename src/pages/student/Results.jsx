import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/results')
      .then(r => setResults(r.data.results || []))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  if (results.length === 0) {
    return (
      <div className="card">
        <div className="tc c2 f14 fw6">No results published yet.</div>
      </div>
    );
  }

  return (
    <div className="stg">
      {results.map((result, i) => (
        <div key={i} className="card">
          <div className="ct">
            📋 Sem {result.semester} — {result.examinationType === 'end-sem' ? 'End Semester' : 'Mid Semester'}
            <span className="bd bp" style={{ marginLeft: 'auto', fontSize: 11 }}>{result.academicYear}</span>
          </div>
          {result.sgpa && (
            <div className="r g8 mb16">
              <div style={{ background: 'var(--PL)', borderRadius: 16, padding: '8px 18px' }}>
                <span className="fw9 cp f16">{result.sgpa.toFixed(2)}</span>
                <span className="c2 f11 fw6 ml4"> SGPA</span>
              </div>
              {result.cgpa && (
                <div style={{ background: 'var(--GL)', borderRadius: 16, padding: '8px 18px' }}>
                  <span className="fw9" style={{ color: '#10b981', fontSize: 16 }}>{result.cgpa.toFixed(2)}</span>
                  <span className="c2 f11 fw6"> CGPA</span>
                </div>
              )}
            </div>
          )}
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Internal</th>
                  <th>External</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.marks.map((m, j) => (
                  <tr key={j}>
                    <td className="fw7">{m.subjectName}</td>
                    <td>{m.internal}</td>
                    <td>{m.external}</td>
                    <td className="fw8">{m.total}</td>
                    <td><span className="bd bp f11">{m.grade || '-'}</span></td>
                    <td>
                      <span className={`bd f11 ${m.status === 'pass' ? 'bg' : 'br'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
