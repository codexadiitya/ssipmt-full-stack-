const xlsx = require('xlsx');
const User = require('../models/User');

const processBulkImport = async (buffer) => {
  let successCount = 0;
  let errorCount = 0;
  let errors = [];

  try {
    // 1. Read the Excel/CSV file from buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 2. Convert to JSON
    // Expected headers: Name, Email, Enrollment No, Branch, Semester, Password
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return { success: false, message: 'The uploaded file is empty or formatted incorrectly.' };
    }

    // 3. Process each row
    for (const [index, row] of data.entries()) {
      const rowNum = index + 2; // +1 for 0-index, +1 for header row
      
      try {
        // Map common variations of column names
        const name = row['Name'] || row['name'];
        const email = row['Email'] || row['email'];
        const enrollmentNo = row['Enrollment No'] || row['EnrollmentNo'] || row['enrollment_no'] || row['Enrollment Number'];
        const branch = row['Branch'] || row['branch'];
        const semester = row['Semester'] || row['semester'] || row['Sem'];
        const password = row['Password'] || row['password'] || 'password123'; // Default password

        if (!name || !email || !enrollmentNo || !branch || !semester) {
          throw new Error('Missing required fields (Name, Email, Enrollment No, Branch, Semester).');
        }

        // Check for existing user by Email or Enrollment No
        const existingUser = await User.findOne({
          $or: [{ email }, { enrollmentNo }]
        });

        if (existingUser) {
          throw new Error(existingUser.email === email 
            ? `Email ${email} is already registered.` 
            : `Enrollment Number ${enrollmentNo} is already registered.`);
        }

        // Create the user
        await User.create({
          name,
          email,
          password,
          role: 'student',
          enrollmentNo,
          branch,
          semester: Number(semester)
        });

        successCount++;
      } catch (rowError) {
        errorCount++;
        errors.push(`Row ${rowNum}: ${rowError.message}`);
      }
    }

    return {
      success: true,
      summary: {
        total: data.length,
        success: successCount,
        failed: errorCount,
        errors: errors.slice(0, 10) // Only return the first 10 errors to prevent massive responses
      }
    };

  } catch (err) {
    console.error('Bulk Import Error:', err);
    return { success: false, message: 'Failed to parse the file. Please ensure it is a valid Excel or CSV file.' };
  }
};

module.exports = { processBulkImport };
