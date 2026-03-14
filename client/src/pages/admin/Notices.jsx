import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CATEGORIES = ['general', 'exam', 'event', 'holiday', 'result', 'fee'];

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', category: 'exam', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/notices')
      .then(r => setNotices(r.data.notices || []))
      .catch(() => toast.error('Failed to load notices'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target.checked ? 'high' : 'medium') : e.target.value }));

  const create = async e => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Please enter title and message');
    setSaving(true);
    try {
      await api.post('/api/admin/notices', { ...form, targetAudience: 'all' });
      toast.success('Notice posted!');
      setForm({ title: '', content: '', category: 'exam', priority: 'medium' });
      load();
    } catch { 
      toast.error('Failed to post notice'); 
    } finally { 
      setSaving(false); 
    }
  };

  const remove = async id => {
    if (!window.confirm('Remove this notice?')) return;
    try {
      await api.delete(`/api/admin/notices/${id}`);
      toast.success('Notice removed');
      load();
    } catch { 
      toast.error('Failed to delete'); 
    }
  };

  const getCatStyle = (cat) => {
    const c = cat.toLowerCase();
    if (c === 'exam') return { bg: 'var(--RL)', col: 'var(--R)' };
    if (c === 'event') return { bg: 'var(--PL)', col: 'var(--P)' };
    if (c === 'holiday') return { bg: 'var(--OL)', col: 'var(--O)' };
    return { bg: 'var(--GL)', col: 'var(--G)' };
  };

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      
      {/* Post Notice Card */}
      <div className="card" style={{ padding: '32px 40px' }}>
        <div className="ct" style={{ fontSize: '18px', marginBottom: '24px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>📤</span> Post New Notice
        </div>
        
        <form onSubmit={create}>
          <div className="fld mb20">
            <label className="lbl">TITLE</label>
            <input className="inp" style={{ background: 'var(--bg)' }} placeholder="Notice title" value={form.title} onChange={set('title')} />
          </div>
          
          <div className="fld mb20">
            <label className="lbl">MESSAGE</label>
            <textarea className="inp" rows={4} style={{ background: 'var(--bg)', borderRadius: '24px' }} placeholder="Notice details..." value={form.content} onChange={set('content')} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div className="fld" style={{ marginBottom: 0, flex: 1, minWidth: '200px', maxWidth: '300px' }}>
              <label className="lbl">CATEGORY</label>
              <select className="inp" value={form.category} onChange={set('category')} style={{ textTransform: 'capitalize' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
               <input 
                 type="checkbox" 
                 id="important" 
                 checked={form.priority === 'high'}
                 onChange={set('priority')}
                 style={{ width: '20px', height: '20px', accentColor: 'var(--T)', cursor: 'pointer' }} 
               />
               <label htmlFor="important" style={{ fontSize: '12px', fontWeight: 800, color: 'var(--T2)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                 Mark as important
               </label>
            </div>
          </div>
          
          <button type="submit" className="btn btn-p" style={{ padding: '14px 28px', fontSize: '14px' }} disabled={saving}>
            {saving ? <><div className="ld" /> Posting…</> : '📢 Post Notice'}
          </button>
        </form>
      </div>

      {/* All Notices List */}
      <div className="card" style={{ padding: '32px 40px' }}>
        <div className="ct" style={{ fontSize: '18px', marginBottom: '24px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>🗂</span> All Notices
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? <LoadingSkeleton count={3} /> : notices.map((n, i) => {
             const style = getCatStyle(n.category || 'general');
             return (
               <div key={n._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < notices.length - 1 ? '1px solid var(--bdr)' : 'none', flexWrap: 'wrap', gap: '12px' }}>
                 <div>
                   <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--T)', marginBottom: '4px' }}>{n.title}</div>
                   <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--T3)' }}>
                     {n.postedBy?.name || 'Admin'} · {new Date(n.createdAt).toLocaleDateString()}
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: style.bg, color: style.col, padding: '6px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'capitalize' }}>
                      {n.category || 'General'}
                    </div>
                    <button 
                       onClick={() => remove(n._id)}
                       style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--RL)', color: 'var(--R)', border: '1px solid #fda4af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                    >
                       <span style={{ fontSize: '14px' }}>🗑</span>
                    </button>
                 </div>
               </div>
             );
          })}
          {notices.length === 0 && !loading && <div className="c3 f13 fw7 tc mt24">No notices found.</div>}
        </div>
      </div>
    </div>
  );
}
