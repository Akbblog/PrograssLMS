/**
 * Quick script to generate a sample student card PDF for testing.
 * Usage: node scripts/generate_sample_student_card.js <studentId>
 */
const fs = require('fs');
const path = require('path');
const qrGenerator = require('../services/qrcode/qrGenerator.service');
const documentGenerator = require('../services/documentGenerator');

async function run() {
  const studentId = process.argv[2] || 'test-student-1';
  // Minimal fake student if not found in DB
  let student = { id: studentId, name: 'Test Student', currentClassLevel: 'Grade 1', dateOfBirth: '2015-01-01' };

  // Try to fetch real student when using Prisma
  try {
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const s = await prisma.student.findUnique({ where: { id: studentId } });
      if (s) student = s;
      await prisma.$disconnect();
    }
  } catch (e) { /* ignore */ }

  const { dataUrl } = await qrGenerator.generateQRCodeImage({ id: student.id, type: 'student' });
  const pdfBuffer = await documentGenerator.generateStudentCard({ student, qrDataUrl: dataUrl });
  const out = path.join(__dirname, '..', 'uploads', `student-${student.id}-card.pdf`);
  fs.writeFileSync(out, pdfBuffer);
  console.log('Wrote PDF to', out);
}

run().catch(err => { console.error(err); process.exit(1); });
