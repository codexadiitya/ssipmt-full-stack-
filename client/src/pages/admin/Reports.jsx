import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

export default function Reports() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (semester) params.append('semester', semester);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const res = await api.get(`/api/admin/reports/attendance?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      toast.success('Report downloaded successfully!');
      
    } catch (err) {
      toast.error('Failed to generate report or no records found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      <div className="card">
        <div className="ct" style={{ marginBottom: '24px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>📊</span> 
          Export Attendance Reports
        </div>

        <div className="c2 f14 mb24">
          Generate an official CSV report containing student attendance data. You can filter the data by branch, semester, or date range before downloading.
        </div>

        <div className="g2 mb20">
          <div className="fld">
            <label className="lbl">BRANCH</label>
            <select className="inp" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          
          <div className="fld">
            <label className="lbl">SEMESTER</label>
            <select className="inp" value={semester} onChange={e => setSemester(e.target.value)}>
               <option value="">All Semesters</option>
               {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>

        <div className="g2 mb32">
          <div className="fld">
            <label className="lbl">START DATE</label>
            <input type="date" className="inp" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="fld">
            <label className="lbl">END DATE</label>
            <input type="date" className="inp" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <button 
           onClick={handleDownload} 
           className="btn btn-p" 
           disabled={loading}
           style={{ padding: '14px 24px', fontSize: '15px' }}
        >
          {loading ? <><div className="ld" /> Generating File...</> : '📥 Download CSV Report'}
        </button>
      </div>
    </div>
  );
}
