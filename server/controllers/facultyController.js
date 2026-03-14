const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Notice = require('../models/Notice');

// ── @GET /api/faculty/dashboard ───────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const subjects = await Subject.find({ faculty: req.user._id });
    const totalStudents = await User.countDocuments({ role: 'student', branch: req.user.branch });

    // Today's attendance marked by this faculty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const markedToday = await Attendance.countDocuments({
      markedBy: req.user._id,
      date: { $gte: today },
    });

    const notices = await Notice.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category priority createdAt');

    res.json({
      faculty: {
        name: req.user.name,
        branch: req.user.branch,
      },
      totalSubjects: subjects.length,
      subjects: subjects.map((s) => ({ id: s._id, name: s.name, code: s.code, semester: s.semester })),
      totalStudents,
      markedToday,
      notices,
    });
  } catch (err) {
    console.error('faculty getDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/faculty/students ────────────────────────────────────────────────
const getStudents = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const filter = { role: 'student' };
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);

    const students = await User.find(filter).select('name enrollmentNo branch semester email phone');
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @POST /api/faculty/attendance ─────────────────────────────────────────────
const markAttendance = async (req, res) => {
  try {
    const { subjectId, date, records } = req.body;
    // records: [{ studentId, status }]

    if (!subjectId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'subjectId, date, and records[] are required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const attendanceDate = new Date(date);

    const ops = records.map(({ studentId, status }) => ({
      updateOne: {
        filter: { student: studentId, subject: subjectId, date: attendanceDate },
        update: {
          $set: {
            student: studentId,
            subject: subjectId,
            date: attendanceDate,
            status: status || 'absent',
            markedBy: req.user._id,
            semester: subject.semester,
            branch: subject.branch,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ message: `Attendance marked for ${records.length} student(s)` });
  } catch (err) {
    console.error('markAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/faculty/attendance/:subjectId ───────────────────────────────────
const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date } = req.query;

    const filter = { subject: subjectId };
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name enrollmentNo')
      .sort({ date: -1 });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getStudents, markAttendance, getAttendanceBySubject };
