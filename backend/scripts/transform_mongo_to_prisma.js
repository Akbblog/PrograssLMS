const fs = require('fs');
const path = require('path');

function guessName(doc) {
  return doc.name || doc.fullName || ((doc.firstName || '') + ' ' + (doc.lastName || '')).trim() || null;
}

function transformStudent(doc) {
  return {
    name: guessName(doc),
    email: doc.email || (doc.emails && doc.emails[0]) || null,
    studentId: doc.studentId || doc.admissionNo || doc.registrationNumber || null,
    phone: doc.phone || doc.mobile || doc.phoneNumber || null,
    avatar: doc.avatar || doc.photo || null,
    schoolId: doc.schoolId || doc.school || 'SCHOOL-IMPORT-1'
  };
}

function transformTeacher(doc) {
  return {
    firstName: doc.firstName || doc.first_name || guessName(doc),
    lastName: doc.lastName || doc.last_name || null,
    email: doc.email || (doc.emails && doc.emails[0]) || null,
    phone: doc.phone || doc.mobile || null,
    avatar: doc.avatar || doc.photo || null,
    schoolId: doc.schoolId || doc.school || 'SCHOOL-IMPORT-1'
  };
}

function transformClass(doc) {
  return {
    name: doc.name || doc.title || null,
    section: doc.section || null,
    schoolId: doc.schoolId || doc.school || 'SCHOOL-IMPORT-1'
  };
}

function transformSubject(doc) {
  return {
    name: doc.name || doc.title || null,
    code: doc.code || null,
    schoolId: doc.schoolId || doc.school || 'SCHOOL-IMPORT-1'
  };
}

const mappings = {
  students: transformStudent,
  teachers: transformTeacher,
  classes: transformClass,
  subjects: transformSubject
};

function readInput(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  try {
    return JSON.parse(raw);
  } catch (e) {
    // try newline-delimited JSON
    return raw.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node transform_mongo_to_prisma.js <collection> <input.json> <output.json>');
    process.exit(2);
  }
  const [collection, inputFile, outputFile] = args;
  const transform = mappings[collection];
  if (!transform) {
    console.error('Unknown collection:', collection);
    process.exit(3);
  }

  const docs = readInput(path.resolve(inputFile));
  const out = docs.map(transform).filter(d => d && (d.email || d.name));
  fs.writeFileSync(path.resolve(outputFile), JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} records to ${outputFile}`);
}

if (require.main === module) main();

// expose helper for programmatic use
module.exports._transform = function(collection, doc) {
  const mapper = mappings[collection];
  if (!mapper) return null;
  return mapper(doc);
};

module.exports = function(collection, inputFile, outputFile) {
  // backward compatible call
  const docs = readInput(inputFile);
  return docs.map(d => mappings[collection](d)).filter(Boolean);
};
// Helper script to transform exported Mongo JSON into simplified objects for Prisma seeding.
// Usage: node scripts/transform_mongo_to_prisma.js students.json students_prisma.json

const fs = require('fs');

const infile = process.argv[2];
const outfile = process.argv[3] || 'students_prisma.json';

if (!infile) {
  console.error('Usage: node transform_mongo_to_prisma.js <infile.json> [outfile.json]');
  process.exit(1);
}

const raw = fs.readFileSync(infile, 'utf8');
let arr = [];
try {
  arr = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse input JSON:', e.message);
  process.exit(1);
}

const out = arr.map(doc => {
  // Handle common mongo export shapes (with _id.$oid or _id)
  const id = doc._id && doc._id.$oid ? doc._id.$oid : (doc._id || doc.id || undefined);
  return {
    id: id || undefined,
    name: doc.name || `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'Unknown',
    email: doc.email || doc.contact?.email || null,
    studentId: doc.studentId || doc.studentId || null,
    phone: doc.phone || doc.contact?.phone || null,
    avatar: doc.avatar || doc.photo || null,
    schoolId: doc.schoolId && doc.schoolId.$oid ? doc.schoolId.$oid : (doc.schoolId || null),
  };
});

fs.writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log('Wrote', outfile);
