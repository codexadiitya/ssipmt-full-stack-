const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createNotice,
  getNotices,
  deleteNotice,
  getAttendanceReport,
  bulkImportStudents
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);

// User management
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/users/import', upload.single('file'), bulkImportStudents);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Notice management
router.post('/notices', createNotice);
router.get('/notices', getNotices);
router.delete('/notices/:id', deleteNotice);

// Reports
const { exportAttendance } = require('../controllers/exportController');
router.get('/attendance-report', getAttendanceReport); // Used for table view
router.get('/reports/attendance', exportAttendance);     // Used for CSV download

module.exports = router;
