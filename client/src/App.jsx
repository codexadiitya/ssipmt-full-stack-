import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import Attendance from './pages/student/Attendance';
import Results from './pages/student/Results';
import Timetable from './pages/student/Timetable';

// Faculty pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MarkAttendance from './pages/faculty/MarkAttendance';
import UploadNotes from './pages/faculty/UploadNotes';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import Notices from './pages/admin/Notices';

/* ═══════════════════════════════════════════
   INLINE GLOBAL CSS (preserves existing design)
═══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fustat:wght@300;400;500;600;700;800;900&display=swap');
html,body,#root{height:100%;margin:0;padding:0;background:var(--bg)}
*{box-sizing:border-box;-webkit-font-smoothing:antialiased}
:root{
  --bg:#eceef0;--w:#ffffff;--bdr:#e2e8f0;
  --P:#a28ef9;--PL:#f5ebfb;--PM:#d1c4f5;
  --G:#a4f5a6;--GL:#e8fdf0;--O:#ffd89d;--OL:#fff3e3;
  --R:#f43f5e;--RL:#ffe4e6;--B:#3b82f6;--BL:#dbeafe;
  --T:#1a1a1a;--T2:#4b5563;--T3:#9ca3af;
  --sh:0 8px 32px rgba(0,0,0,0.06);--sh2:0 12px 48px rgba(162,142,249,0.2);
}
body{font-family:'Fustat',sans-serif;color:var(--T);min-height:100vh}
button,input,select,textarea{font-family:'Fustat',sans-serif;color:var(--T)}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--PM);border-radius:4px}
::-webkit-scrollbar-track{background:transparent}
.app{position:relative;min-height:100vh;background:var(--bg);overflow:hidden}
.split-header{position:absolute;top:0;left:0;right:0;height:420px;background:var(--P);z-index:0;border-bottom-left-radius:40px;border-bottom-right-radius:40px;box-shadow:inset 0 -20px 40px rgba(0,0,0,0.05)}
@media(max-width:900px){.split-header{height:250px}}
.sb{display:none}
.main{position:relative;z-index:10;display:flex;flex-direction:column;height:100vh;overflow-y:auto;padding-bottom:100px;width:100%}
.tb{height:70px;min-height:70px;padding:10px 24px;display:flex;align-items:center;justify-content:space-between;top:0;z-index:30;color:#fff}
.tb-l{display:flex;align-items:center;gap:12px}
.tb-title{font-weight:900;font-size:24px;color:#fff}
.tb-sub{font-size:12px;color:rgba(255,255,255,.8);margin-top:2px;font-weight:600}
.tb-r{display:flex;align-items:center;gap:12px}
.ib{width:48px;height:48px;border-radius:24px;background:var(--w);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s;position:relative;flex-shrink:0;color:var(--P);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
.ib:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.15)}
.nb{position:absolute;top:-4px;right:-4px;width:22px;height:22px;border-radius:50%;background:var(--w);color:var(--P);font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;border:2px solid var(--w);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
.av{width:48px;height:48px;border-radius:24px;background:var(--w);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:var(--P);flex-shrink:0;box-shadow:0 8px 24px rgba(0,0,0,0.1);transition:.2s;border:2px solid transparent;cursor:pointer}
.av:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.15)}
.page{padding:20px 0px 40px;flex:1;position:relative;width:100%}
.page > * { padding: 0 24px; max-width: 1200px; margin: 0 auto; }
.card{background:var(--w);border-radius:32px;padding:32px;box-shadow:var(--sh);position:relative;transition:all 0.3s;margin-bottom:24px}
.ct{font-weight:900;font-size:18px;color:var(--T);display:flex;align-items:center;gap:12px;margin-bottom:20px}
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:24px}
.st{background:var(--w);border-radius:32px;padding:24px;cursor:pointer;transition:all .3s cubic-bezier(0.16,1,0.3,1);position:relative;box-shadow:var(--sh)}
.st:hover{transform:translateY(-6px);box-shadow:var(--sh2)}
.st-ic{width:56px;height:56px;border-radius:24px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 8px 16px rgba(0,0,0,0.04)}
.st-n{font-weight:900;font-size:32px;line-height:1;margin-bottom:8px}
.st-l{font-size:14px;color:var(--T2);font-weight:800}
.st-s{font-size:12px;color:var(--T3);margin-top:6px;font-weight:600}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:32px;font-size:15px;font-weight:800;border:none;cursor:pointer;transition:all .2s;white-space:nowrap}
.btn-xs{padding:6px 14px;font-size:12px;border-radius:20px;gap:6px}
.btn-sm{padding:10px 20px;font-size:14px;border-radius:24px}
.btn-p{background:var(--T);color:var(--w);box-shadow:0 12px 24px rgba(0,0,0,.15)}
.btn-p:hover{background:#000;transform:translateY(-2px);box-shadow:0 16px 32px rgba(0,0,0,.25)}
.btn-l{background:var(--w);color:var(--T);border:2px solid var(--bdr);box-shadow:0 4px 12px rgba(0,0,0,0.03)}
.btn-l:hover{background:var(--bg);border-color:var(--P);color:var(--P)}
.btn-d{background:var(--RL);color:var(--R);border:2px solid #fda4af}
.fld{margin-bottom:20px}
.lbl{display:block;font-size:12px;font-weight:900;color:var(--T2);margin-bottom:8px;letter-spacing:.5px;text-transform:uppercase}
.inp{width:100%;background:var(--bg);border:none;border-radius:24px;padding:16px 20px;color:var(--T);font-size:15px;outline:none;transition:.2s;font-weight:700}
.inp::placeholder{color:var(--T3);font-weight:600}
.inp:focus{background:var(--P);color:#fff;box-shadow:0 12px 32px rgba(162,142,249,.3)}
.inp:focus::placeholder{color:rgba(255,255,255,.7)}
select.inp option{background:var(--w);color:var(--T)}
textarea.inp{resize:vertical;min-height:120px;border-radius:28px}
.bd{display:inline-flex;align-items:center;padding:8px 16px;border-radius:24px;font-size:12px;font-weight:900;white-space:nowrap;letter-spacing:0.5px}
.bp{background:var(--P);color:#fff}.bg{background:var(--G);color:var(--T)}.by{background:var(--O);color:var(--T)}.br{background:var(--RL);color:var(--R)}.bb{background:var(--T);color:var(--w)}.bz{background:var(--bg);color:var(--T2)}
.pb{background:var(--bg);border-radius:20px;height:12px;overflow:hidden;border:none}
.pf{height:100%;border-radius:20px;transition:width .8s cubic-bezier(0.16,1,0.3,1)}
.pp{background-color:var(--P)}.pg{background-color:var(--G)}.pr{background-color:var(--R)}.py{background-color:var(--O)}
.tw{overflow-x:auto;border-radius:28px;border:1.5px solid var(--bdr);background:var(--w)}
table{width:100%;border-collapse:separate;font-size:14px;border-spacing:0}
th{background:var(--bg);color:var(--T2);font-weight:900;padding:16px 20px;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;white-space:nowrap}
th:first-child{border-top-left-radius:24px}th:last-child{border-top-right-radius:24px}
td{padding:16px 20px;border-bottom:1.5px solid var(--bdr);vertical-align:middle;font-weight:600}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--PL);color:var(--P);cursor:pointer}
.nc{background:var(--w);border-radius:32px;padding:24px;margin-bottom:16px;cursor:pointer;transition:all .3s;box-shadow:var(--sh);border-left:8px solid var(--bdr)}
.nc:hover{transform:translateX(6px);box-shadow:var(--sh2)}
.nc.exam{border-left-color:var(--R)}.nc.event{border-left-color:var(--P)}.nc.holiday{border-left-color:var(--O)}.nc.general{border-left-color:var(--G)}
.tabs{display:flex;gap:8px;background:var(--w);border-radius:32px;padding:8px;margin-bottom:28px;overflow-x:auto;box-shadow:0 8px 24px rgba(0,0,0,0.04);border:1px solid var(--bdr)}
.tab{flex:none;padding:12px 24px;border-radius:24px;font-size:14px;font-weight:900;cursor:pointer;color:var(--T2);border:none;background:transparent;white-space:nowrap;transition:all .3s}
.tab.on{background:var(--T);color:var(--w);box-shadow:0 8px 16px rgba(0,0,0,.25)}
.tab:hover:not(.on){background:var(--bg);color:var(--T)}
.tsl{padding:18px 24px;border-radius:36px;margin-bottom:16px;transition:.3s;background:var(--w);box-shadow:var(--sh);display:flex;align-items:center;position:relative}
.tsl:hover{transform:translateX(6px);box-shadow:var(--sh2)}
.date-pill{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;width:68px;height:96px;border-radius:34px;background:var(--w);box-shadow:var(--sh);cursor:pointer;transition:.3s}
.date-pill.on{background:var(--P);color:#fff;box-shadow:var(--sh2);transform:scale(1.05)}
.date-pill .d-day{font-size:12px;font-weight:800;margin-bottom:6px;opacity:0.8;text-transform:uppercase}
.date-pill .d-num{font-size:24px;font-weight:900}
.date-row{display:flex;gap:14px;overflow-x:auto;padding-bottom:12px;margin-bottom:24px;padding-top:4px}
.date-row::-webkit-scrollbar{display:none}
.atg{display:flex;border-radius:28px;overflow:hidden;background:var(--bg);padding:6px}
.atb{padding:8px 20px;border-radius:22px;font-size:13px;font-weight:900;border:none;cursor:pointer;background:transparent;color:var(--T2);transition:.3s}
.atb.P{background:var(--G);color:var(--T);box-shadow:0 4px 12px rgba(164,245,166,0.5)}
.atb.A{background:var(--R);color:#fff;box-shadow:0 4px 12px rgba(244,63,94,0.4)}
.bnav-container{position:fixed;bottom:32px;left:0;right:0;display:flex;justify-content:center;z-index:50;pointer-events:none}
.bnav-wrapper{pointer-events:auto;background:var(--T);padding:12px 16px;border-radius:48px;display:flex;align-items:center;gap:12px;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.bni{display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:30px;color:rgba(255,255,255,.4);cursor:pointer;transition:all .3s cubic-bezier(0.16,1,0.3,1)}
.bni.on{background:var(--w);color:var(--T);box-shadow:0 8px 24px rgba(255,255,255,0.2)}
.bni:hover:not(.on){color:#fff;transform:scale(1.1)}
.lw{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--P);position:relative;overflow:hidden;padding:24px}
.lcard{position:relative;background:var(--w);border-radius:48px;padding:48px 40px;width:100%;max-width:480px;box-shadow:0 32px 100px rgba(0,0,0,.4);z-index:10}
.lic{width:72px;height:72px;border-radius:24px;background:var(--P);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-weight:900;font-size:32px;color:#fff;box-shadow:0 16px 32px rgba(162,142,249,.4)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.r{display:flex;align-items:center}.jb{justify-content:space-between}.jc{justify-content:center}.w{flex-wrap:wrap}
.g6{gap:6px}.g8{gap:8px}.g10{gap:10px}.g12{gap:12px}.g16{gap:16px}
.mt4{margin-top:4px}.mt6{margin-top:6px}.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}.mt20{margin-top:20px}.mt24{margin-top:24px}
.mb6{margin-bottom:6px}.mb8{margin-bottom:8px}.mb10{margin-bottom:10px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}.mb20{margin-bottom:20px}.mb24{margin-bottom:24px}
.fw5{font-weight:500}.fw6{font-weight:600}.fw7{font-weight:700}.fw8{font-weight:800}.fw9{font-weight:900}
.f9{font-size:9px}.f10{font-size:10px}.f11{font-size:11px}.f12{font-size:12px}.f13{font-size:13px}.f14{font-size:14px}.f15{font-size:15px}.f16{font-size:16px}.f18{font-size:18px}.f20{font-size:20px}.f24{font-size:24px}
.c2{color:var(--T2)}.c3{color:var(--T3)}.cp{color:var(--P)}.cg{color:var(--G)}.cr{color:var(--R)}.cy{color:var(--O)}.cb{color:var(--B)}.cw{color:#fff}
.tc{text-align:center}
.stg>*{animation:fu .5s cubic-bezier(0.16,1,0.3,1) both}
.stg>*:nth-child(1){animation-delay:.05s}.stg>*:nth-child(2){animation-delay:.1s}
.stg>*:nth-child(3){animation-delay:.15s}.stg>*:nth-child(4){animation-delay:.2s}
.fu{animation:fu .5s cubic-bezier(0.16,1,0.3,1) forwards}
@keyframes fu{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp{to{transform:rotate(360deg)}}
.ld{width:18px;height:18px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp 1s linear infinite}
@media(max-width:900px){.g2{grid-template-columns:1fr}.hide{display:none!important}.page{padding:10px 16px 100px}}
@media(max-width:500px){.lcard{padding:32px 24px}}
`;

// Navigation config per role
const NAV = {
  student: [
    { path: '/student/dashboard', label: 'Dashboard', icon: '🏠', title: 'Dashboard' },
    { path: '/student/attendance', label: 'Attendance', icon: '✓', title: 'Attendance' },
    { path: '/student/results', label: 'Results', icon: '📊', title: 'Results' },
    { path: '/student/timetable', label: 'Timetable', icon: '📅', title: 'My Schedule' },
  ],
  faculty: [
    { path: '/faculty/dashboard', label: 'Dashboard', icon: '🏠', title: 'Dashboard' },
    { path: '/faculty/attendance', label: 'Attendance', icon: '✓', title: 'Mark Attendance' },
    { path: '/faculty/notes', label: 'Notes', icon: '📤', title: 'Upload Notes' },
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠', title: 'Dashboard' },
    { path: '/admin/students', label: 'Students', icon: '🎓', title: 'Manage Students' },
    { path: '/admin/notices', label: 'Notices', icon: '📢', title: 'Notices' },
  ],
};

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = NAV[user?.role] || [];
  const currentNav = navItems.find(n => location.pathname.startsWith(n.path));

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="app">
      <div className="split-header" />
      <div className="main">
        {/* TOPBAR */}
        <div className="tb">
          <div className="tb-l">
            <div>
              <div className="tb-title">{currentNav?.title || 'SSIPMT Portal'}</div>
              <div className="tb-sub">SSIPMT · {user?.branch || 'Administration'}</div>
            </div>
          </div>
          <div className="tb-r">
            <div
              className="av"
              onClick={handleLogout}
              title="Logout"
              style={{ fontSize: 18 }}
            >
              {user?.name?.[0] ?? '?'}
            </div>
          </div>
        </div>

        {/* PAGE */}
        <div className="page fu" key={location.pathname}>
          {children}
        </div>
      </div>

      {/* FLOATING BOTTOM NAV */}
      <div className="bnav-container">
        <div className="bnav-wrapper">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`bni${location.pathname.startsWith(item.path) ? ' on' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
              style={{ fontSize: 22 }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route element={<AppShell><Routes><Route index element={null} /></Routes></AppShell>}>
          </Route>
          <Route path="/student/dashboard" element={<AppShell><StudentDashboard /></AppShell>} />
          <Route path="/student/attendance" element={<AppShell><Attendance /></AppShell>} />
          <Route path="/student/results" element={<AppShell><Results /></AppShell>} />
          <Route path="/student/timetable" element={<AppShell><Timetable /></AppShell>} />
        </Route>

        {/* Faculty routes */}
        <Route element={<ProtectedRoute role="faculty" />}>
          <Route path="/faculty/dashboard" element={<AppShell><FacultyDashboard /></AppShell>} />
          <Route path="/faculty/attendance" element={<AppShell><MarkAttendance /></AppShell>} />
          <Route path="/faculty/notes" element={<AppShell><UploadNotes /></AppShell>} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AppShell><AdminDashboard /></AppShell>} />
          <Route path="/admin/students" element={<AppShell><ManageStudents /></AppShell>} />
          <Route path="/admin/notices" element={<AppShell><Notices /></AppShell>} />
        </Route>

        {/* Default - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
