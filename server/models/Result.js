const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    subjectName: { type: String, required: true },
    internal: { type: Number, default: 0 },
    external: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    grade: { type: String },
    status: { type: String, enum: ['pass', 'fail', 'backlog'], default: 'pass' },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: String, ref: 'User', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    branch: { type: String, required: true },
    examinationType: {
      type: String,
      enum: ['mid-sem', 'end-sem'],
      required: true,
    },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    marks: [marksSchema],
    sgpa: { type: Number },
    cgpa: { type: Number },
    publishedAt: { type: Date, default: Date.now },
    publishedBy: { type: String, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
