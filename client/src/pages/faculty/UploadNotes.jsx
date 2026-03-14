import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const SUBJECTS = ['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Engineering Maths'];

export default function UploadNotes() {
  const [form, setForm] = useState({ title: '', subject: SUBJECTS[0], type: 'PDF', size: '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // In a real deployment, this would upload a file and save the metadata to /api/faculty/notes
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulated — replace with actual endpoint when ready
      await new Promise(r => setTimeout(r, 800));
      toast.success('Note metadata saved!');
      setForm({ title: '', subject: SUBJECTS[0], type: 'PDF', size: '' });
    } catch {
      toast.error('Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="ct">📤 Upload Study Note</div>
      <form onSubmit={handleSubmit}>
        <div className="fld">
          <label className="lbl">Title</label>
          <input className="inp" required placeholder="DS Unit 1 — Arrays" value={form.title} onChange={set('title')} />
        </div>
        <div className="g2">
          <div className="fld">
            <label className="lbl">Subject</label>
            <select className="inp" value={form.subject} onChange={set('subject')}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fld">
            <label className="lbl">File Type</label>
            <select className="inp" value={form.type} onChange={set('type')}>
              <option>PDF</option><option>PPT</option><option>DOC</option>
            </select>
          </div>
        </div>
        <div className="fld">
          <label className="lbl">File Size (e.g. 2.4 MB)</label>
          <input className="inp" placeholder="2.4 MB" value={form.size} onChange={set('size')} />
        </div>
        <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? <><div className="ld" /> Uploading…</> : '📤 Upload Note'}
        </button>
      </form>
    </div>
  );
}
