// Default field definitions for card templates.
// Extracted into a separate file so that controllers can import them
// without pulling in @react-pdf/renderer (which fails on serverless).

const DEFAULT_STUDENT_FIELDS = [
  { fieldId: 'name', label: 'Name', show: true, section: 'left', order: 0, fontSize: 14, bold: true, fontColor: '#000000', alignment: 'left' },
  { fieldId: 'studentId', label: 'ID', show: true, section: 'left', order: 1, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'class', label: 'Class', show: true, section: 'left', order: 2, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'fatherName', label: "Father's Name", show: true, section: 'left', order: 3, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'dateOfBirth', label: 'DOB', show: true, section: 'left', order: 4, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'bloodGroup', label: 'Blood Group', show: false, section: 'left', order: 5, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'phone', label: 'Phone', show: false, section: 'left', order: 6, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'address', label: 'Address', show: false, section: 'left', order: 7, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
  { fieldId: 'emergencyContact', label: 'Emergency', show: false, section: 'left', order: 8, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
];

const DEFAULT_STAFF_FIELDS = [
  { fieldId: 'name', label: 'Name', show: true, section: 'left', order: 0, fontSize: 14, bold: true, fontColor: '#000000', alignment: 'left' },
  { fieldId: 'teacherId', label: 'ID', show: true, section: 'left', order: 1, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'role', label: 'Designation', show: true, section: 'left', order: 2, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'subject', label: 'Subject', show: true, section: 'left', order: 3, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'email', label: 'Email', show: true, section: 'left', order: 4, fontSize: 9, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'phone', label: 'Phone', show: false, section: 'left', order: 5, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'dateEmployed', label: 'Joined', show: true, section: 'left', order: 6, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'bloodGroup', label: 'Blood Group', show: false, section: 'left', order: 7, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'address', label: 'Address', show: false, section: 'left', order: 8, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
];

module.exports = { DEFAULT_STUDENT_FIELDS, DEFAULT_STAFF_FIELDS };
