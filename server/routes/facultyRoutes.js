const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getStudents,
  markAttendance,
  getAttendanceBySubject,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('faculty', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.post('/attendance', markAttendance);
router.get('/attendance/:subjectId', getAttendanceBySubject);

module.exports = router;
