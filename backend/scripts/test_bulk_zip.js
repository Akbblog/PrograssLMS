/**
 * Simple test: zip existing sample PDFs in uploads/ into uploads/test-cards.zip
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const uploads = path.join(__dirname, '..', 'uploads');
const outFile = path.join(uploads, 'test-cards.zip');
if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });

const output = fs.createWriteStream(outFile);
const archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', () => console.log('Wrote zip', outFile, archive.pointer(), 'bytes'));
archive.on('error', err => { throw err; });
archive.pipe(output);

// include any student/staff sample PDFs if present
['student-test-student-1-card.pdf','staff-test-staff-1-card.pdf'].forEach(f => {
  const p = path.join(uploads, f);
  if (fs.existsSync(p)) archive.file(p, { name: f });
});

archive.finalize();
