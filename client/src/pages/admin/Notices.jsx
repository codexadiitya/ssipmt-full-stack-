import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CATEGORIES = ['general', 'exam', 'event', 'holiday', 'result', 'fee'];

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', targetAudience: 'all' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/notices')
      .then(r => setNotices(r.data.notices || []))
      .catch(() => toast.error('Failed to load notices'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const create = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/admin/notices', form);
      toast.success('Notice posted!');
      setForm({ title: '', content: '', category: 'general', priority: 'medium', targetAudience: 'all' });
      load();
    } catch { toast.error('Failed to post notice'); }
    finally { setSaving(false); }
  };

  const remove = async id => {
    if (!confirm('Remove this notice?')) return;
    try {
      await api.delete(`/api/admin/notices/${id}`);
      toast.success('Notice removed');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="card">
        <div className="ct">📢 Post New Notice</div>
        <form onSubmit={create}>
          <div className="fld">
            <label className="lbl">Title</label>
            <input className="inp" required placeholder="Notice title" value={form.title} onChange={set('title')} />
          </div>
          <div className="fld">
            <label className="lbl">Content</label>
            <textarea className="inp" required rows={4} placeholder="Notice content…" value={form.content} onChange={set('content')} />
          </div>
          <div className="g2 mb8">
            <div className="fld">
              <label className="lbl">Category</label>
              <select className="inp" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld">
              <label className="lbl">Audience</label>
              <select className="inp" value={form.targetAudience} onChange={set('targetAudience')}>
                <option value="all">All</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
            {saving ? <><div className="ld" /> Posting…</> : '📢 Post Notice'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="ct">All Notices ({notices.length})</div>
        {loading ? <LoadingSkeleton count={3} /> : notices.map((n, i) => (
          <div key={i} className={`nc ${n.category || 'general'}`}>
            <div className="r jb g6 mb6">
              <span className="fw8 f14">{n.title}</span>
              <button className="btn btn-xs btn-d" onClick={() => remove(n._id)}>Remove</button>
            </div>
            <div className="c2 f12 mb8">{n.category} · {n.targetAudience} · {n.postedBy?.name}</div>
            <div className="c2 f13">{n.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
