const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is missing']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is missing']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number
  },
  fileType: {
    type: String,
    default: 'PDF'
  },
  fileSize: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
