const express = require('express');
const router = express.Router();
const { uploadNote, getNotes, deleteNote } = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/upload', authorize('faculty', 'admin'), upload.single('file'), uploadNote);
router.get('/', getNotes);
router.delete('/:id', authorize('faculty', 'admin'), deleteNote);

module.exports = router;
