import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function ManageStudents() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Bulk Import State
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/users?role=student&limit=50')
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); })
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success('User deactivated');
      load();
    } catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.enrollmentNo?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadTemplate = () => {
    // A simple CSV string template
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Enrollment No,Branch,Semester,Password\nJohn Doe,john.doe@example.com,EN2024001,IT,1,password123\nJane Smith,jane.s@example.com,EN2024002,CSE,3,password123";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return toast.error('Please select a file first.');
    
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/admin/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(res.data.message, { duration: 5000 });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      load(); // Reload the table
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to import students');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      
      {/* Top Action Bar */}
      <div className="card" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
           <input className="inp" placeholder="Search students by name or enrollment ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div 
             onClick={() => fileInputRef.current.click()}
             style={{ background: 'var(--GL)', color: 'var(--G)', border: '2px dashed #86efac', borderRadius: '24px', padding: '10px 20px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
             <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
             <span>{file ? file.name : '📁 Select CSV/Excel'}</span>
          </div>
          
          {file && (
             <button onClick={handleImport} className="btn btn-p" disabled={importing} style={{ padding: '12px 24px' }}>
               {importing ? <><div className="ld" /> Importing...</> : '🚀 Run Import'}
             </button>
          )}

          {!file && (
             <button onClick={downloadTemplate} className="btn btn-l" style={{ padding: '12px 20px' }}>
               📥 Download Template
             </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        <div className="ct" style={{ marginBottom: '24px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>🎓</span> 
          All Students ({total})
        </div>
        
        {loading ? <LoadingSkeleton count={5} /> : (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ENROLLMENT NO</th>
                  <th>BRANCH & SEM</th>
                  <th>EMAIL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--T)', fontWeight: 800, fontSize: '14px' }}>{u.name}</td>
                    <td style={{ fontSize: '13px', fontWeight: 700, color: 'var(--T2)' }}>{u.enrollmentNo || '-'}</td>
                    <td>
                       <span className="bd bg f11" style={{ marginRight: '6px' }}>{u.branch || '-'}</span>
                       <span className="bd by f11">Sem {u.semester || '-'}</span>
                    </td>
                    <td className="c2 f13">{u.email}</td>
                    <td>
                      <button 
                        className="btn btn-xs" 
                        onClick={() => deactivate(u._id)}
                        style={{ background: 'var(--RL)', color: 'var(--R)', border: '1px solid #fda4af' }}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="5" className="tc c3 fw7" style={{ padding: '40px' }}>No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
