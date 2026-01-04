const React = require('react');
const ReactPDF = require('@react-pdf/renderer');

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
  // Render to a stream and collect into a buffer (more robust across versions)
  const stream = await ReactPDF.renderToStream(element);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);
  if (!pdfBuffer || pdfBuffer.length === 0) throw new Error('Failed to generate PDF buffer');
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

module.exports = { generateDocument, generateFeeVoucher };
