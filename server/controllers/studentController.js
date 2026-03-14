const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Subject = require('../models/Subject');
const Notice = require('../models/Notice');

// ── @GET /api/student/dashboard ───────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const { _id: studentId, branch, semester } = req.user;

    // Attendance summary
    const attendanceRecords = await Attendance.find({ student: studentId }).populate('subject', 'name code');
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === 'present').length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    // Per-subject attendance breakdown
    const bySubject = {};
    attendanceRecords.forEach((r) => {
      if (!r.subject) return;
      const key = r.subject._id.toString();
      if (!bySubject[key]) {
        bySubject[key] = { subject: r.subject, total: 0, present: 0 };
      }
      bySubject[key].total++;
      if (r.status === 'present') bySubject[key].present++;
    });
    
    const subjectwiseAttendance = Object.values(bySubject).map(sub => ({
      name: sub.subject.name,
      code: sub.subject.code,
      percentage: sub.total > 0 ? Math.round((sub.present / sub.total) * 100) : 0
    }));

    // Latest result
    const latestResult = await Result.findOne({ student: studentId })
      .sort({ createdAt: -1 })
      .populate('marks.subject', 'name code');

    // Notices (latest 5)
    const notices = await Notice.find({
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'student' },
      ],
      $or: [
        { branch: null },
        { branch },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category priority createdAt');

    res.json({
      student: {
        name: req.user.name,
        enrollmentNo: req.user.enrollmentNo,
        branch,
        semester,
      },
      attendancePercentage: Number(attendancePercentage),
      totalClasses: total,
      presentClasses: present,
      subjectwiseAttendance,
      latestResult: latestResult || null,
      notices,
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/student/attendance ──────────────────────────────────────────────
const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id })
      .populate('subject', 'name code')
      .sort({ date: -1 });

    // Group by subject
    const bySubject = {};
    records.forEach((r) => {
      const key = r.subject._id.toString();
      if (!bySubject[key]) {
        bySubject[key] = { subject: r.subject, total: 0, present: 0, records: [] };
      }
      bySubject[key].total++;
      if (r.status === 'present') bySubject[key].present++;
      bySubject[key].records.push({ date: r.date, status: r.status });
    });

    res.json({ attendance: Object.values(bySubject) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/student/results ─────────────────────────────────────────────────
const getResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id }).sort({ semester: -1, createdAt: -1 });
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/student/timetable ───────────────────────────────────────────────
const getTimetable = async (req, res) => {
  try {
    const { branch, semester } = req.user;
    const subjects = await Subject.find({ branch, semester }).populate('faculty', 'name');

    // Flatten timetable
    const slots = [];
    subjects.forEach((sub) => {
      sub.timetable.forEach((slot) => {
        slots.push({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          subjectName: sub.name,
          subjectCode: sub.code,
          faculty: sub.faculty ? sub.faculty.name : 'TBA',
        });
      });
    });

    // Sort by day order then time
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    slots.sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    res.json({ timetable: slots });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/student/notices ─────────────────────────────────────────────────
const getNotices = async (req, res) => {
  try {
    const { branch } = req.user;
    const notices = await Notice.find({
      isActive: true,
      targetAudience: { $in: ['all', 'student'] },
      $or: [{ branch: null }, { branch }, { branch: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');

    res.json({ notices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getAttendance, getResults, getTimetable, getNotices };
