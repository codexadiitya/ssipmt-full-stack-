const express = require('express');
const router = express.Router();
const { getDashboard, getAttendance, getResults, getTimetable, getNotices } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/attendance', getAttendance);
router.get('/results', getResults);
router.get('/timetable', getTimetable);
router.get('/notices', getNotices);

module.exports = router;
