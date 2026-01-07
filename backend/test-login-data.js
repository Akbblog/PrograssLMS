/**
 * Test script to check if test users exist in the database
 * Run with: node test-login-data.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { getPrisma } = require('./lib/prismaClient');

async function checkTestData() {
  console.log('\n=== Checking Test Data ===\n');
  console.log('USE_PRISMA:', process.env.USE_PRISMA);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('SUPERADMIN_EMAIL:', process.env.SUPERADMIN_EMAIL);
  
  const prisma = getPrisma();
  if (!prisma) {
    console.error('\n❌ Failed to initialize Prisma');
    process.exit(1);
  }

  try {
    console.log('\n--- Checking Admin Table ---');
    const adminCount = await prisma.admin.count();
    const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true }, take: 5 });
    console.log('Total admins:', adminCount);
    console.log('Sample admins:', admins);

    console.log('\n--- Checking Teacher Table ---');
    const teacherCount = await prisma.teacher.count();
    const teachers = await prisma.teacher.findMany({ select: { id: true, name: true, email: true }, take: 5 });
    console.log('Total teachers:', teacherCount);
    console.log('Sample teachers:', teachers);

    console.log('\n--- Checking Student Table ---');
    const studentCount = await prisma.student.count();
    const students = await prisma.student.findMany({ select: { id: true, name: true, email: true }, take: 5 });
    console.log('Total students:', studentCount);
    console.log('Sample students:', students);

    console.log('\n--- Testing Superadmin Credentials ---');
    const SA_EMAIL = (process.env.SUPERADMIN_EMAIL || 'SA@progresslms.com').toLowerCase();
    const SA_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'Superpass';
    console.log('Expected email:', SA_EMAIL);
    console.log('Expected password:', SA_PASSWORD);
    console.log('✅ Superadmin credentials configured');

    if (adminCount === 0) {
      console.warn('\n⚠️  WARNING: No admins found in database');
      console.log('Run: node backend/scripts/bootstrap-superadmin.js');
      console.log('Or: npm run seed:notifications');
    }

    if (teacherCount === 0) {
      console.warn('\n⚠️  WARNING: No teachers found in database');
    }

    if (studentCount === 0) {
      console.warn('\n⚠️  WARNING: No students found in database');
    }

    console.log('\n✅ Test data check complete\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error checking test data:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

checkTestData();
