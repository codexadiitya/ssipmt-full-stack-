const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: String, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    markedBy: { type: String, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index: one record per student per subject per date
attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
