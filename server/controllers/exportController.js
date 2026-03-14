const { Parser } = require('json2csv');
const Attendance = require('../models/Attendance');

// @desc    Download Attendance Report as CSV
// @route   GET /api/admin/reports/attendance
// @access  Private (Admin)
const exportAttendance = async (req, res) => {
  try {
    const { branch, semester, startDate, endDate } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Fetch records and populate related fields
    const records = await Attendance.find(filter)
      .populate('student', 'name enrollmentNo branch semester')
      .populate('subject', 'name code')
      .sort({ date: -1 });

    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the selected criteria.' });
    }

    // Flatten the data for CSV
    const csvData = records.map(record => ({
      'Date': new Date(record.date).toLocaleDateString(),
      'Student Name': record.student?.name || 'N/A',
      'Enrollment No': record.student?.enrollmentNo || 'N/A',
      'Branch': record.student?.branch || 'N/A',
      'Semester': record.student?.semester || 'N/A',
      'Subject': record.subject?.name || 'N/A',
      'Subject Code': record.subject?.code || 'N/A',
      'Status': record.status === 'present' ? 'Present' : 'Absent'
    }));

    // Generate CSV
    const fields = ['Date', 'Student Name', 'Enrollment No', 'Branch', 'Semester', 'Subject', 'Subject Code', 'Status'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    // Send HTTP response
    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    return res.send(csv);

  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).json({ message: 'Server error generating report' });
  }
};

module.exports = { exportAttendance };
