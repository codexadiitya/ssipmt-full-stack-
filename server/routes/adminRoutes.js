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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Notice management
router.post('/notices', createNotice);
router.get('/notices', getNotices);
router.delete('/notices/:id', deleteNotice);

// Reports
router.get('/attendance-report', getAttendanceReport);

module.exports = router;
