import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function ManageStudents() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/api/admin/users?role=student&limit=50')
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); })
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deactivate = async (id) => {
    if (!confirm('Deactivate this user?')) return;
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

  if (loading) return <LoadingSkeleton count={5} />;

  return (
    <div>
      <div className="card">
        <div className="ct">🎓 Students ({total})</div>
        <div className="fld">
          <input className="inp" placeholder="Search by name or enrollment…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Enrollment No</th>
                <th>Branch</th>
                <th>Sem</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i}>
                  <td className="fw7">{u.name}</td>
                  <td className="f12">{u.enrollmentNo || '-'}</td>
                  <td>{u.branch || '-'}</td>
                  <td>{u.semester || '-'}</td>
                  <td className="c2 f12">{u.email}</td>
                  <td>
                    <button className="btn btn-xs btn-d" onClick={() => deactivate(u._id)}>
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
