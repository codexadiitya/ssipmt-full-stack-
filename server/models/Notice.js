


const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'exam', 'event', 'holiday', 'result', 'fee'],
      default: 'general',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    targetAudience: {
      type: String,
      enum: ['all', 'student', 'faculty'],
      default: 'all',
    },
    branch: { type: String }, // null means all branches
    semester: { type: Number }, // null means all semesters
    postedBy: { type: String, ref: 'User', required: true },
    attachmentUrl: { type: String },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
