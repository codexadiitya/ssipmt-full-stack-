const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary.config');

// @desc    Upload a new note
// @route   POST /api/notes/upload
// @access  Private (Faculty)
exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, subject, fileType } = req.body;

    const note = await Note.create({
      title,
      subject,
      fileUrl: req.file.path,
      cloudinaryId: req.file.filename,
      uploader: req.user._id,
      branch: req.user.branch,
      semester: req.user.semester,
      fileType: fileType || 'PDF',
      fileSize: (req.file.size / 1024 / 1024).toFixed(2) + ' MB'
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

// @desc    Get all notes (filtered by branch for students, or uploader for faculty)
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query = { branch: req.user.branch };
    } else if (req.user.role === 'faculty') {
      query = { uploader: req.user._id };
    }

    const notes = await Note.find(query)
      .populate('uploader', 'name')
      .sort('-createdAt');

    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (Faculty)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership
    if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(note.cloudinaryId);

    // Delete from DB
    await note.deleteOne();

    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting note' });
  }
};
