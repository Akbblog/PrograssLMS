const mongoose = require('mongoose');
require('dotenv').config();

async function addIndexes() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;

  // Student indexes
  await db.collection('students').createIndex({ schoolId: 1, name: 1 });
  await db.collection('students').createIndex({ schoolId: 1, email: 1 }, { unique: true, sparse: true });
  await db.collection('students').createIndex({ schoolId: 1, currentClassLevels: 1 });
  await db.collection('students').createIndex({ name: 'text', email: 'text' });

  // Teacher indexes
  await db.collection('teachers').createIndex({ schoolId: 1, name: 1 });
  await db.collection('teachers').createIndex({ schoolId: 1, email: 1 }, { unique: true, sparse: true });
  await db.collection('teachers').createIndex({ name: 'text', email: 'text' });

  // Attendance indexes (critical for speed)
  await db.collection('attendances').createIndex({ schoolId: 1, date: 1 });
  await db.collection('attendances').createIndex({ schoolId: 1, student: 1, date: 1 });

  // Class indexes
  await db.collection('classlevels').createIndex({ schoolId: 1, name: 1 });

  // Subject indexes
  await db.collection('subjects').createIndex({ schoolId: 1, name: 1 });

  // Academic years & terms
  await db.collection('academicyears').createIndex({ schoolId: 1, isCurrent: 1 });
  await db.collection('academicterms').createIndex({ schoolId: 1, name: 1 });

  console.log('All indexes created successfully!');
  process.exit(0);
}

addIndexes().catch(err => {
  console.error('Failed to create indexes', err);
  process.exit(1);
});