// ── DEMO MODE: Mock Data & API Interceptor ─────────────────────────────────
// When VITE_DEMO_MODE=true, all API calls return this mock data.
// No backend needed. Toggle off to reconnect to real backend.

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// ── Demo Users ──────────────────────────────────────────────────────────────
const DEMO_USERS = {
  student: {
    _id: 'd1', name: 'Rahul Sharma', email: 'student@ssipmt.ac.in',
    role: 'student', branch: 'CSE', semester: 5, enrollmentNo: 'EN2024001',
  },
  faculty: {
    _id: 'd2', name: 'Prof. Meena Gupta', email: 'faculty@ssipmt.ac.in',
    role: 'faculty', branch: 'CSE',
  },
  admin: {
    _id: 'd3', name: 'Dr. Pradeep Verma', email: 'admin@ssipmt.ac.in',
    role: 'admin', branch: 'Administration',
  },
};

export function getDemoUser(email) {
  const e = email.toLowerCase();
  if (e.includes('faculty')) return DEMO_USERS.faculty;
  if (e.includes('admin')) return DEMO_USERS.admin;
  return DEMO_USERS.student;
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const SUBJECTS = [
  { _id: 's1', name: 'Operating Systems', code: 'CS501' },
  { _id: 's2', name: 'Data Structures', code: 'CS502' },
  { _id: 's3', name: 'DBMS', code: 'CS503' },
  { _id: 's4', name: 'Computer Networks', code: 'CS504' },
  { _id: 's5', name: 'Engineering Maths', code: 'MA501' },
];

const STUDENTS = [
  { _id: 'st1', name: 'Rahul Sharma', email: 'rahul@ssipmt.ac.in', enrollmentNo: 'EN2024001', branch: 'CSE', semester: 5, role: 'student', createdAt: '2025-07-01' },
  { _id: 'st2', name: 'Priya Patel', email: 'priya@ssipmt.ac.in', enrollmentNo: 'EN2024002', branch: 'CSE', semester: 5, role: 'student', createdAt: '2025-07-01' },
  { _id: 'st3', name: 'Aman Verma', email: 'aman@ssipmt.ac.in', enrollmentNo: 'EN2024003', branch: 'CSE', semester: 5, role: 'student', createdAt: '2025-07-02' },
  { _id: 'st4', name: 'Sneha Gupta', email: 'sneha@ssipmt.ac.in', enrollmentNo: 'EN2024004', branch: 'IT', semester: 5, role: 'student', createdAt: '2025-07-03' },
  { _id: 'st5', name: 'Vikram Singh', email: 'vikram@ssipmt.ac.in', enrollmentNo: 'EN2024005', branch: 'CSE', semester: 5, role: 'student', createdAt: '2025-07-03' },
  { _id: 'st6', name: 'Ananya Mishra', email: 'ananya@ssipmt.ac.in', enrollmentNo: 'EN2024006', branch: 'ECE', semester: 3, role: 'student', createdAt: '2025-07-04' },
  { _id: 'st7', name: 'Rohan Joshi', email: 'rohan@ssipmt.ac.in', enrollmentNo: 'EN2024007', branch: 'IT', semester: 3, role: 'student', createdAt: '2025-07-05' },
  { _id: 'st8', name: 'Kavita Yadav', email: 'kavita@ssipmt.ac.in', enrollmentNo: 'EN2024008', branch: 'CSE', semester: 5, role: 'student', createdAt: '2025-07-05' },
];

const NOTICES = [
  { _id: 'n1', title: 'Mid-Semester Examination Schedule', content: 'The mid-semester examinations will commence from March 20, 2026. Students are advised to collect their hall tickets from the examination cell.', category: 'exam', priority: 'high', postedBy: { name: 'Dr. Pradeep Verma' }, createdAt: '2026-03-10', targetAudience: 'all' },
  { _id: 'n2', title: 'Annual Tech Fest — TechSpark 2026', content: 'SSIPMT\'s Annual Technical Festival TechSpark 2026 will be held on April 5-7. Register your teams for coding competitions, robotics, and hackathon events.', category: 'event', priority: 'medium', postedBy: { name: 'Prof. Meena Gupta' }, createdAt: '2026-03-08', targetAudience: 'all' },
  { _id: 'n3', title: 'Holi Holiday — March 14', content: 'The institute will remain closed on March 14 on account of Holi. Classes will resume on March 17.', category: 'holiday', priority: 'medium', postedBy: { name: 'Admin Office' }, createdAt: '2026-03-05', targetAudience: 'all' },
  { _id: 'n4', title: 'Library Fine Clearance Deadline', content: 'All students must clear library dues before March 25 to be eligible for end-semester examinations.', category: 'general', priority: 'medium', postedBy: { name: 'Librarian' }, createdAt: '2026-03-01', targetAudience: 'all' },
];

const ATTENDANCE = [
  { subject: SUBJECTS[0], present: 38, total: 42 },
  { subject: SUBJECTS[1], present: 35, total: 40 },
  { subject: SUBJECTS[2], present: 28, total: 38 },
  { subject: SUBJECTS[3], present: 40, total: 42 },
  { subject: SUBJECTS[4], present: 30, total: 40 },
];

const RESULTS = [
  {
    semester: 5, examinationType: 'mid-sem', academicYear: '2025-26', sgpa: 8.2, cgpa: 7.9,
    marks: [
      { subjectName: 'Operating Systems', subject: { code: 'CS501' }, internal: 22, external: 58, total: 80, grade: 'A', status: 'pass' },
      { subjectName: 'Data Structures', subject: { code: 'CS502' }, internal: 25, external: 62, total: 87, grade: 'A+', status: 'pass' },
      { subjectName: 'DBMS', subject: { code: 'CS503' }, internal: 20, external: 52, total: 72, grade: 'B+', status: 'pass' },
      { subjectName: 'Computer Networks', subject: { code: 'CS504' }, internal: 24, external: 60, total: 84, grade: 'A', status: 'pass' },
      { subjectName: 'Engineering Maths', subject: { code: 'MA501' }, internal: 18, external: 48, total: 66, grade: 'B', status: 'pass' },
    ],
  },
];

const TIMETABLE = [
  { day: 'Monday', startTime: '9:00 AM', subjectName: 'Operating Systems', subjectCode: 'CS501', faculty: 'Prof. Meena Gupta', room: 'LH-1' },
  { day: 'Monday', startTime: '10:00 AM', subjectName: 'Data Structures', subjectCode: 'CS502', faculty: 'Prof. Rajesh Kumar', room: 'LH-2' },
  { day: 'Monday', startTime: '11:30 AM', subjectName: 'DBMS Lab', subjectCode: 'CS503', faculty: 'Prof. Suman Jain', room: 'Lab-1' },
  { day: 'Tuesday', startTime: '9:00 AM', subjectName: 'Computer Networks', subjectCode: 'CS504', faculty: 'Prof. Anil Tiwari', room: 'LH-3' },
  { day: 'Tuesday', startTime: '10:00 AM', subjectName: 'Engineering Maths', subjectCode: 'MA501', faculty: 'Prof. Deepak Soni', room: 'LH-1' },
  { day: 'Tuesday', startTime: '12:00 PM', subjectName: 'Operating Systems', subjectCode: 'CS501', faculty: 'Prof. Meena Gupta', room: 'LH-2' },
  { day: 'Wednesday', startTime: '9:00 AM', subjectName: 'DBMS', subjectCode: 'CS503', faculty: 'Prof. Suman Jain', room: 'LH-1' },
  { day: 'Wednesday', startTime: '10:00 AM', subjectName: 'Data Structures Lab', subjectCode: 'CS502', faculty: 'Prof. Rajesh Kumar', room: 'Lab-2' },
  { day: 'Wednesday', startTime: '12:00 PM', subjectName: 'Computer Networks', subjectCode: 'CS504', faculty: 'Prof. Anil Tiwari', room: 'LH-3' },
  { day: 'Thursday', startTime: '9:00 AM', subjectName: 'Operating Systems', subjectCode: 'CS501', faculty: 'Prof. Meena Gupta', room: 'LH-2' },
  { day: 'Thursday', startTime: '10:00 AM', subjectName: 'Data Structures', subjectCode: 'CS502', faculty: 'Prof. Rajesh Kumar', room: 'LH-1' },
  { day: 'Thursday', startTime: '11:00 AM', subjectName: 'DBMS (Tutorial)', subjectCode: 'CS503', faculty: 'Prof. Suman Jain', room: 'Lab-3' },
  { day: 'Thursday', startTime: '12:00 PM', subjectName: 'Computer Networks', subjectCode: 'CS504', faculty: 'Prof. Anil Tiwari', room: 'LH-3' },
  { day: 'Friday', startTime: '9:00 AM', subjectName: 'Engineering Maths', subjectCode: 'MA501', faculty: 'Prof. Deepak Soni', room: 'LH-1' },
  { day: 'Friday', startTime: '10:00 AM', subjectName: 'CN Lab', subjectCode: 'CS504', faculty: 'Prof. Anil Tiwari', room: 'Lab-3' },
  { day: 'Friday', startTime: '12:00 PM', subjectName: 'Operating Systems', subjectCode: 'CS501', faculty: 'Prof. Meena Gupta', room: 'LH-2' },
  { day: 'Saturday', startTime: '9:00 AM', subjectName: 'Data Structures', subjectCode: 'CS502', faculty: 'Prof. Rajesh Kumar', room: 'LH-1' },
  { day: 'Saturday', startTime: '10:00 AM', subjectName: 'DBMS', subjectCode: 'CS503', faculty: 'Prof. Suman Jain', room: 'LH-2' },
];

const NOTES = [
  { _id: 'nt1', title: 'DS Unit 3 — Trees & Graphs', subject: 'Data Structures', fileType: 'PDF', fileSize: '2.4 MB', fileUrl: '#', semester: 5, uploader: { name: 'Prof. Rajesh Kumar' }, createdAt: '2026-03-12' },
  { _id: 'nt2', title: 'OS Process Scheduling Notes', subject: 'Operating Systems', fileType: 'PDF', fileSize: '1.8 MB', fileUrl: '#', semester: 5, uploader: { name: 'Prof. Meena Gupta' }, createdAt: '2026-03-10' },
  { _id: 'nt3', title: 'DBMS ER Diagrams & Normalization', subject: 'DBMS', fileType: 'PPT', fileSize: '3.1 MB', fileUrl: '#', semester: 5, uploader: { name: 'Prof. Suman Jain' }, createdAt: '2026-03-08' },
  { _id: 'nt4', title: 'CN OSI Model Complete Notes', subject: 'Computer Networks', fileType: 'PDF', fileSize: '1.5 MB', fileUrl: '#', semester: 5, uploader: { name: 'Prof. Anil Tiwari' }, createdAt: '2026-03-05' },
  { _id: 'nt5', title: 'Laplace Transform — Solved Examples', subject: 'Engineering Maths', fileType: 'PDF', fileSize: '0.9 MB', fileUrl: '#', semester: 5, uploader: { name: 'Prof. Deepak Soni' }, createdAt: '2026-03-01' },
];

// ── Route-based Mock API Handler ────────────────────────────────────────────

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

const MOCK_ROUTES = {
  // ── Auth ─────────────────────────────
  'POST /api/auth/login': async (body) => {
    const user = getDemoUser(body?.email || 'student');
    return {
      accessToken: 'demo_token_' + user.role,
      refreshToken: 'demo_refresh_' + user.role,
      user,
    };
  },
  'POST /api/auth/register': async () => ({
    accessToken: 'demo_token_student',
    refreshToken: 'demo_refresh_student',
    user: DEMO_USERS.student,
  }),
  'POST /api/auth/refresh': async () => ({
    accessToken: 'demo_token_refreshed',
  }),
  'GET /api/auth/profile': async () => {
    const stored = localStorage.getItem('ssipmt_user');
    const user = stored ? JSON.parse(stored) : DEMO_USERS.student;
    return { profile: user };
  },
  'PUT /api/auth/update-password': async () => ({
    message: 'Password updated (demo mode)',
  }),

  // ── Student ──────────────────────────
  'GET /api/student/dashboard': async () => ({
    attendancePercentage: 82,
    notices: NOTICES,
    subjectwiseAttendance: ATTENDANCE.map(a => ({
      name: a.subject.name,
      percentage: Math.round((a.present / a.total) * 100),
    })),
    latestResult: RESULTS[0],
  }),
  'GET /api/student/attendance': async () => ({
    attendance: ATTENDANCE,
  }),
  'GET /api/student/results': async () => ({
    results: RESULTS,
  }),
  'GET /api/student/timetable': async () => ({
    timetable: TIMETABLE,
  }),

  // ── Faculty ──────────────────────────
  'GET /api/faculty/dashboard': async () => ({
    totalStudents: STUDENTS.length,
    subjects: SUBJECTS.slice(0, 3).map(s => ({ id: s._id, name: s.name, code: s.code })),
  }),
  'GET /api/faculty/students': async () => ({
    students: STUDENTS,
  }),
  'POST /api/faculty/attendance': async () => ({
    message: 'Attendance saved (demo mode)',
  }),

  // ── Admin ────────────────────────────
  'GET /api/admin/dashboard': async () => ({
    totalStudents: 248,
    totalFaculty: 32,
    totalNotices: NOTICES.length,
    totalSubjects: 45,
    recentUsers: [
      ...STUDENTS.slice(0, 4),
      { ...DEMO_USERS.faculty, createdAt: '2025-06-15' },
    ],
  }),
  'GET /api/admin/users': async () => ({
    users: STUDENTS,
    total: STUDENTS.length,
  }),
  'DELETE /api/admin/users/': async () => ({
    message: 'User deactivated (demo mode)',
  }),
  'POST /api/admin/users/import': async () => ({
    message: 'Imported 0 students (demo mode — no actual import)',
  }),
  'GET /api/admin/notices': async () => ({
    notices: NOTICES,
  }),
  'POST /api/admin/notices': async () => ({
    message: 'Notice posted (demo mode)',
  }),
  'DELETE /api/admin/notices/': async () => ({
    message: 'Notice removed (demo mode)',
  }),
  'GET /api/admin/reports/attendance': async () => {
    // Return a fake CSV blob
    const csv = 'Name,EnrollmentNo,Branch,Semester,Present,Total,Percentage\n' +
      STUDENTS.map(s => `${s.name},${s.enrollmentNo},${s.branch},${s.semester},35,42,83`).join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },

  // ── Notes ────────────────────────────
  'GET /api/notes': async () => ({
    success: true,
    notes: NOTES,
  }),
  'POST /api/notes/upload': async () => ({
    success: true,
    message: 'Note uploaded (demo mode)',
  }),
  'DELETE /api/notes/': async () => ({
    message: 'Note deleted (demo mode)',
  }),
};

// ── Match a request to a mock route ─────────────────────────────────────────
export async function handleMockRequest(method, url, body, config) {
  await delay(Math.random() * 300 + 200); // Simulate network delay

  const m = method.toUpperCase();
  const path = url.replace(/^https?:\/\/[^/]+/, ''); // Strip baseURL

  // Exact match first
  const exactKey = `${m} ${path}`;
  if (MOCK_ROUTES[exactKey]) {
    const result = await MOCK_ROUTES[exactKey](body);
    // Special case for blob responses (reports)
    if (result instanceof Blob) {
      return { data: result, status: 200 };
    }
    return { data: result, status: 200 };
  }

  // Prefix match (for routes with IDs like /api/notes/:id)
  for (const key of Object.keys(MOCK_ROUTES)) {
    const [km, kpath] = key.split(' ');
    if (km === m && path.startsWith(kpath)) {
      const result = await MOCK_ROUTES[key](body);
      if (result instanceof Blob) return { data: result, status: 200 };
      return { data: result, status: 200 };
    }
  }

  // Query string routes (strip query params and try again)
  const pathWithoutQuery = path.split('?')[0];
  const queryKey = `${m} ${pathWithoutQuery}`;
  if (MOCK_ROUTES[queryKey]) {
    const result = await MOCK_ROUTES[queryKey](body);
    if (result instanceof Blob) return { data: result, status: 200 };
    return { data: result, status: 200 };
  }

  // Fallback: return empty success
  console.warn(`[DEMO] No mock for: ${m} ${path}`);
  return { data: { message: 'Demo mode — no data for this route' }, status: 200 };
}
