const fs = require('fs');
const path = require('path');
const transform = require('./transform_mongo_to_prisma');

// Usage: node transform_all_exports.js <input_dir> <output_dir>
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node transform_all_exports.js <input_dir> <output_dir>');
  process.exit(2);
}
const [inputDir, outputDir] = args.map(p => path.resolve(p));
if (!fs.existsSync(inputDir)) {
  console.error('Input directory not found:', inputDir);
  process.exit(3);
}
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const mapping = {
  students: 'students_prisma.json',
  teachers: 'teachers_prisma.json',
  classes: 'classes_prisma.json',
  subjects: 'subjects_prisma.json'
};

const files = fs.readdirSync(inputDir);
for (const file of files) {
  const base = path.basename(file, path.extname(file)).toLowerCase();
  if (mapping[base]) {
    const inPath = path.join(inputDir, file);
    const outPath = path.join(outputDir, mapping[base]);
    console.log('Transforming', base, '->', outPath);
    // call transform_mongo_to_prisma.js as module
    const docs = require('./transform_mongo_to_prisma_runner')(base, inPath);
    fs.writeFileSync(outPath, JSON.stringify(docs, null, 2));
    console.log(`Wrote ${docs.length} records to ${outPath}`);
  } else {
    console.log('Skipping file (no mapping):', file);
  }
}
