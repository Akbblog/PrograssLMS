/**
 * Quick script to generate a sample staff card PDF for testing.
 * Usage: node scripts/generate_sample_staff_card.js <staffId>
 */
const fs = require('fs');
const path = require('path');
const qrGenerator = require('../services/qrcode/qrGenerator.service');
const documentGenerator = require('../services/documentGenerator');

async function run() {
  const staffId = process.argv[2] || 'test-staff-1';
  let staff = { id: staffId, name: 'Test Staff', role: 'Teacher', email: 'staff@example.com' };
  try {
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const s = await prisma.teacher.findUnique({ where: { id: staffId } });
      if (s) staff = s;
      await prisma.$disconnect();
    }
  } catch (e) { /* ignore */ }

  const { dataUrl } = await qrGenerator.generateQRCodeImage({ id: staff.id, type: 'staff' });
  const pdfBuffer = await documentGenerator.generateStaffCard({ staff, qrDataUrl: dataUrl });
  const out = path.join(__dirname, '..', 'uploads', `staff-${staff.id}-card.pdf`);
  fs.writeFileSync(out, pdfBuffer);
  console.log('Wrote PDF to', out);
}

run().catch(err => { console.error(err); process.exit(1); });
