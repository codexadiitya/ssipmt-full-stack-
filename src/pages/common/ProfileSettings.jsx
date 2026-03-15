import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    api.get('/api/auth/profile')
      .then(r => setProfile(r.data.profile))
      .catch(() => toast.error('Failed to load profile data'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error('New passwords do not match!');
    }
    if (pwdForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    setSavingPwd(true);
    try {
      await api.put('/api/auth/update-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      });
      toast.success('Password updated successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="stg" style={{ marginTop: '20px', paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ 
            width: '80px', height: '80px', borderRadius: '40px', background: 'var(--PL)', 
            color: 'var(--P)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '32px', fontWeight: 900, border: '2px solid #e5d5f6' 
        }}>
          {profile?.name?.[0] || user?.name?.[0] || '?'}
        </div>
        <div style={{ flex: 1 }}>
          <div className="fw9" style={{ fontSize: '24px', color: 'var(--T)', marginBottom: '4px' }}>
            {profile?.name || user?.name}
          </div>
          <div className="fw6" style={{ fontSize: '14px', color: 'var(--T2)' }}>
            {profile?.email}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
             <span className="bd bp" style={{ textTransform: 'capitalize' }}>{profile?.role} Row</span>
             {profile?.branch && <span className="bd bg">{profile.branch}</span>}
             {profile?.semester && <span className="bd by">Semester {profile.semester}</span>}
             {profile?.enrollmentNo && <span className="bd bz">{profile.enrollmentNo}</span>}
          </div>
        </div>
        <div>
          <button onClick={handleLogout} className="btn btn-d" style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card" style={{ padding: '40px' }}>
        <div className="ct" style={{ fontSize: '18px', marginBottom: '24px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>🔐</span> Change Password
        </div>
        
        <form onSubmit={handlePasswordChange}>
          <div className="fld mb20">
            <label className="lbl">CURRENT PASSWORD</label>
            <input 
              type="password" 
              className="inp" 
              style={{ background: 'var(--bg)' }} 
              placeholder="Enter current password" 
              value={pwdForm.currentPassword} 
              onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} 
              required
            />
          </div>
          
          <div className="g2 mb32">
            <div className="fld" style={{ marginBottom: 0 }}>
              <label className="lbl">NEW PASSWORD</label>
              <input 
                type="password" 
                className="inp" 
                style={{ background: 'var(--bg)' }} 
                placeholder="New password (min. 6 chars)" 
                value={pwdForm.newPassword} 
                onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} 
                required
              />
            </div>
            <div className="fld" style={{ marginBottom: 0 }}>
              <label className="lbl">CONFIRM NEW PASSWORD</label>
              <input 
                type="password" 
                className="inp" 
                style={{ background: 'var(--bg)' }} 
                placeholder="Confirm new password" 
                value={pwdForm.confirmPassword} 
                onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} 
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-p" style={{ padding: '14px 28px', fontSize: '14px' }} disabled={savingPwd}>
            {savingPwd ? <><div className="ld" /> Updating…</> : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
}
