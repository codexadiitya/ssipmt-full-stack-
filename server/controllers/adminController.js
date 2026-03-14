const User = require('../models/User');
const Notice = require('../models/Notice');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Subject = require('../models/Subject');

// ── @GET /api/admin/dashboard ─────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalNotices, totalSubjects] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Notice.countDocuments({ isActive: true }),
      Subject.countDocuments(),
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role branch semester createdAt');

    res.json({ totalStudents, totalFaculty, totalNotices, totalSubjects, recentUsers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/admin/users ─────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { role, branch, semester, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/admin/users/:id ─────────────────────────────────────────────────
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @PUT /api/admin/users/:id ─────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const allowed = ['name', 'branch', 'semester', 'phone', 'isActive', 'role'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @DELETE /api/admin/users/:id ──────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @POST /api/admin/notices ──────────────────────────────────────────────────
const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, targetAudience, branch, semester, attachmentUrl, expiresAt } = req.body;
    const notice = await Notice.create({
      title,
      content,
      category,
      priority,
      targetAudience,
      branch,
      semester,
      attachmentUrl,
      expiresAt,
      postedBy: req.user._id,
    });
    res.status(201).json({ message: 'Notice created', notice });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/admin/notices ───────────────────────────────────────────────────
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
    res.json({ notices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @DELETE /api/admin/notices/:id ────────────────────────────────────────────
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── @GET /api/admin/attendance-report ────────────────────────────────────────
const getAttendanceReport = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);

    const records = await Attendance.find(filter)
      .populate('student', 'name enrollmentNo')
      .populate('subject', 'name code')
      .sort({ date: -1 })
      .limit(500);

    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getUsers, getUser, updateUser, deleteUser, createNotice, getNotices, deleteNotice, getAttendanceReport };
