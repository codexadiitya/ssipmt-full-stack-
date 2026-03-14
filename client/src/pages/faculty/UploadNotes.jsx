import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const SUBJECTS = ['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Engineering Maths'];

export default function UploadNotes() {
  const [form, setForm] = useState({ title: '', subject: SUBJECTS[0], type: 'PDF' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  const fileInputRef = useRef(null);

  const loadNotes = async () => {
    try {
      const res = await api.get('/api/notes');
      if (res.data.success) setNotes(res.data.notes);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        return toast.error('File too large (Max 10MB)');
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title) return toast.error('Please enter a title');
    if (!file) return toast.error('Please select a file');

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subject', form.subject);
    formData.append('fileType', form.type);
    formData.append('file', file);

    try {
      const res = await api.post('/api/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        toast.success('Note uploaded successfully!');
        setForm({ title: '', subject: SUBJECTS[0], type: 'PDF' });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadNotes();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/api/notes/${id}`);
      toast.success('Note deleted');
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      
      {/* Upload Card */}
      <div className="card">
        <div className="ct" style={{ color: 'var(--T)', fontSize: '18px', marginBottom: '32px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>📤</span> Upload Study Notes
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="g2 mb20">
            <div className="fld" style={{ marginBottom: 0 }}>
              <label className="lbl">TITLE</label>
              <input className="inp" placeholder="e.g. DS Unit 3 — Trees" value={form.title} onChange={set('title')} />
            </div>
            <div className="fld" style={{ marginBottom: 0 }}>
              <label className="lbl">SUBJECT</label>
              <select className="inp" value={form.subject} onChange={set('subject')}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="fld mb24" style={{ maxWidth: '48%' }}>
            <label className="lbl">FILE TYPE</label>
            <select className="inp" value={form.type} onChange={set('type')}>
              <option>PDF</option><option>PPT</option><option>DOC</option>
            </select>
          </div>

          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ 
              border: file ? '2px solid var(--G)' : '2px dashed #d1c4f5', 
              borderRadius: '24px', 
              padding: '40px', 
              textAlign: 'center', 
              marginBottom: '24px',
              cursor: 'pointer',
              background: file ? 'var(--GL)' : 'var(--w)',
              transition: '0.3s'
            }}
          >
             <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.ppt,.pptx" />
             <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.8 }}>{file ? '📄' : '📎'}</div>
             <div style={{ color: file ? 'var(--T)' : '#a28ef9', fontSize: '13px', fontWeight: 700 }}>
               {file ? file.name : 'Click to attach file'}
             </div>
             {file && <div style={{ fontSize: '11px', color: 'var(--T3)', marginTop: '4px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>}
          </div>

          <button type="submit" className="btn btn-p" disabled={loading}>
            {loading ? <><div className="ld" /> Uploading…</> : '📤 Upload Notes'}
          </button>
        </form>
      </div>

      {/* Uploaded Notes Table */}
      <div className="card">
         <div className="ct" style={{ marginBottom: '24px' }}>
           Uploaded Notes ({notes.length})
         </div>
         {fetching ? <LoadingSkeleton count={3} /> : (
           <div className="tw">
             <table>
               <thead>
                 <tr>
                   <th>TITLE</th>
                   <th>SUBJECT</th>
                   <th>DATE</th>
                   <th>SIZE</th>
                   <th>ACTION</th>
                 </tr>
               </thead>
               <tbody>
                 {notes.map(n => (
                   <tr key={n._id}>
                     <td style={{ color: 'var(--T)', fontWeight: 800, fontSize: '13px' }}>{n.title}</td>
                     <td>
                       <span className="bd" style={{ background: '#9d84f7', color: '#fff', fontSize: '11px', textTransform: 'capitalize', padding: '6px 14px', borderRadius: '16px' }}>
                         {n.subject.split(' ')[0]}
                       </span>
                     </td>
                     <td style={{ fontSize: '12px', fontWeight: 700, color: 'var(--T2)' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                     <td style={{ fontSize: '13px', fontWeight: 800, color: 'var(--T2)' }}>
                       {n.fileSize}
                     </td>
                     <td>
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <a href={n.fileUrl} target="_blank" rel="noreferrer" className="btn btn-xs btn-l" style={{ padding: '6px 12px' }}>
                            View
                         </a>
                         <button 
                            onClick={() => deleteNote(n._id)}
                            style={{ background: 'var(--RL)', color: 'var(--R)', border: '1px solid #fda4af', borderRadius: '16px', padding: '6px 16px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                         >
                           <span style={{ fontSize: '12px' }}>🗑</span> Delete
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {notes.length === 0 && (
                   <tr>
                      <td colSpan="5" className="tc c3 fw7" style={{ padding: '40px' }}>No notes uploaded yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         )}
      </div>

    </div>
  );
}
