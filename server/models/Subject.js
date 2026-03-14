const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "10:00"
    room: { type: String },
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    credits: { type: Number, default: 3 },
    faculty: { type: String, ref: 'User' },
    type: { type: String, enum: ['theory', 'lab', 'elective'], default: 'theory' },
    timetable: [timetableSlotSchema],
  },
  { timestamps: true }
);

subjectSchema.index({ code: 1, branch: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
