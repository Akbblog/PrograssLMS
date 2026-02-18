const React = require('react');
// const ReactPDF = require('@react-pdf/renderer'); // Removed to fix ESM import issue

let ReactPDF = null;
const loadReactPDF = async () => {
  if (!ReactPDF) {
    try {
      ReactPDF = await import('@react-pdf/renderer');
    } catch (e) {
      console.error('Failed to load @react-pdf/renderer:', e);
      throw new Error('PDF generation not available in this environment');
    }
  }
  return ReactPDF;
};

// server-side generators
async function generateFeeVoucher(payload) {
  const { studentId, schoolId } = payload || {};

  // Try to fetch student and school info for richer docs (best-effort)
  let student = null;
  let school = null;
  let fee = null;
  try {
    const Student = require('../../models/Students/students.model');
    const School = require('../../models/School.model');
    student = await Student.findById(studentId).lean();
    school = await School.findById(schoolId).lean();
  } catch (e) {
    // ignore if models not found or errors
  }

  // If no explicit fee data provided, create a placeholder
  fee = payload.fee || { amount: payload.amount || 0, dueDate: payload.dueDate };

  const FeeVoucherTemplate = require('./templates/FeeVoucherTemplate');
  const element = FeeVoucherTemplate({ student: student || {}, fee: fee || {}, school: school || {} });

  // Render to Buffer using react-pdf
  // Debug: ensure element is not null
  if (!element) throw new Error('Document element is null');
  
  // Load ReactPDF dynamically
  const pdfRenderer = await loadReactPDF();
  
  // Render to a stream and collect into a buffer (more robust across versions)
  const stream = await pdfRenderer.renderToStream(element);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);
  if (!pdfBuffer || pdfBuffer.length === 0) throw new Error('Failed to generate PDF buffer');
  return pdfBuffer;
}

// Generate student/staff ID card
async function generateStudentCard(payload) {
  const { student = {}, school = {} , qrDataUrl = null, attendanceData = null, academicData = null, template = null } = payload || {};
  const StudentCardTemplate = require('./templates/StudentCardTemplate');
  const element = StudentCardTemplate({ student, qrDataUrl, school, attendanceData, academicData, template });
  if (!element) throw new Error('Document element is null');
  const pdfRenderer = await loadReactPDF();
  const stream = await pdfRenderer.renderToStream(element);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);
  if (!pdfBuffer || pdfBuffer.length === 0) throw new Error('Failed to generate PDF buffer for student card');
  return pdfBuffer;
}

// Generate staff/teacher ID card
async function generateStaffCard(payload) {
  const { staff = {}, school = {}, qrDataUrl = null, employmentInfo = null, template = null } = payload || {};
  const StaffCardTemplate = require('./templates/StaffCardTemplate');
  const element = StaffCardTemplate({ staff, qrDataUrl, school, employmentInfo, template });
  if (!element) throw new Error('Document element is null');
  const pdfRenderer = await loadReactPDF();
  const stream = await pdfRenderer.renderToStream(element);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);
  if (!pdfBuffer || pdfBuffer.length === 0) throw new Error('Failed to generate PDF buffer for staff card');
  return pdfBuffer;
}

// Add more generators (marksheet, idCard, salarySlip) as needed
async function generateDocument(templateType, payload) {
  switch (templateType) {
    case 'feeVoucher':
      return generateFeeVoucher(payload);
    default:
      throw new Error('Generator not implemented for ' + templateType);
  }
}

module.exports = { generateDocument, generateFeeVoucher, generateStudentCard, generateStaffCard };

// Minimal Salary Slip generator (uses @react-pdf/renderer)
async function generateSalarySlip(payload) {
  const { payrollRun, payroll, staff = {}, school = {}, payrollRun: runOverride } = payload || {};
  const run = payrollRun || payroll || runOverride;
  if (!run) throw new Error('Payroll data required');

  const pdfRenderer = await loadReactPDF();
  const ReactPDF = pdfRenderer;
  const React = require('react');
  const { Document, Page, View, Text, StyleSheet } = ReactPDF;

  const styles = StyleSheet.create({
    page: { padding: 18, fontFamily: 'Helvetica', fontSize: 11 },
    header: { marginBottom: 12 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    label: { color: '#555' },
    value: { fontWeight: '600' },
    section: { marginTop: 8, marginBottom: 8 },
  });

  const element = React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, (school && school.name) || 'School'),
        React.createElement(Text, null, `Payslip: ${run.month || run.month} / ${run.year || run.year}`)
      ),
      React.createElement(View, { style: styles.row },
        React.createElement(Text, { style: styles.label }, 'Employee'),
        React.createElement(Text, { style: styles.value }, (staff && staff.personalInfo && staff.personalInfo.firstName) ? `${staff.personalInfo.firstName} ${staff.personalInfo.lastName}` : (staff.name || run.metrics?.staffName || 'Staff'))
      ),
      React.createElement(View, { style: styles.row },
        React.createElement(Text, { style: styles.label }, 'Basic Salary'),
        React.createElement(Text, { style: styles.value }, String(run.baseSalary || run.basicSalary || run.baseSalary || 0))
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Allowances'),
        (run.allowances || []).map((a, idx) => React.createElement(View, { style: styles.row, key: `a-${idx}` },
          React.createElement(Text, null, a.type || a.type),
          React.createElement(Text, null, String(a.amount || a.amount || 0))
        ))
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Deductions'),
        (run.deductions || []).map((d, idx) => React.createElement(View, { style: styles.row, key: `d-${idx}` },
          React.createElement(Text, null, d.type || d.type),
          React.createElement(Text, null, String(d.amount || d.amount || 0))
        ))
      ),
      React.createElement(View, { style: styles.row },
        React.createElement(Text, { style: styles.label }, 'Net Salary'),
        React.createElement(Text, { style: styles.value }, String(run.netSalary || run.net || 0))
      )
    )
  );

  const stream = await ReactPDF.renderToStream(element);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);
  return pdfBuffer;
}

module.exports.generateSalarySlip = generateSalarySlip;

