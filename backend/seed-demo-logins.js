/**
 * Seed demo test data for login testing
 * Run with: node seed-demo-logins.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { getPrisma } = require('./lib/prismaClient');
const { hashPassword } = require('./handlers/passHash.handler');

async function seedDemoData() {
  const prisma = getPrisma();
  if (!prisma) {
    console.error('\n❌ Failed to initialize Prisma');
    process.exit(1);
  }

  try {
    console.log('\n=== Seeding Demo Login Data ===\n');

    // Clear existing data
    await prisma.admin.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.student.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create School
    const school = await prisma.school.create({
      data: {
        name: 'Demo School',
        email: 'admin@school.com',
        address: '123 Education Street',
      }
    });
    console.log('✅ Created school');

    // Create Admin (from DEMO_CREDENTIALS.md)
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.admin.create({
      data: {
        name: 'Admin User',
        email: 'admin@school.com',
        password: adminPassword,
        role: 'admin',
        schoolId: school.id,
      }
    });
    console.log('✅ Created admin:', admin.email);

    // Create 3 Teachers
    const teacherPassword = await hashPassword('teacher123');
    const teachers = [
      { name: 'Robert Smith', email: 'teacher1@progress.edu' },
      { name: 'Maria Garcia', email: 'teacher2@progress.edu' },
      { name: 'Suresh Kumar', email: 'teacher3@progress.edu' },
    ];

    for (const teacherData of teachers) {
      const teacher = await prisma.teacher.create({
        data: {
          name: teacherData.name,
          email: teacherData.email,
          password: teacherPassword,
          role: 'teacher',
          schoolId: school.id,
        }
      });
      console.log(`✅ Created teacher: ${teacher.email}`);
    }

    // Create 5 Students
    const studentPassword = await hashPassword('student123');
    const students = [
      { name: 'Liam Martinez', email: 'student1@progress.edu' },
      { name: 'Noah Miller', email: 'student2@progress.edu' },
      { name: 'Oliver Wilson', email: 'student3@progress.edu' },
      { name: 'James Hernandez', email: 'student4@progress.edu' },
      { name: 'Elijah Martinez', email: 'student5@progress.edu' },
    ];

    for (const studentData of students) {
      const student = await prisma.student.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          password: studentPassword,
          role: 'student',
          schoolId: school.id,
        }
      });
      console.log(`✅ Created student: ${student.email}`);
    }

    console.log('\n=== Demo Data Seeded Successfully ===\n');
    console.log('Test Credentials:');
    console.log('═══════════════════════════════════════════');
    console.log('SuperAdmin:');
    console.log('  Email: SA@progresslms.com');
    console.log('  Password: Superpass\n');
    console.log('School Admin:');
    console.log('  Email: admin@school.com');
    console.log('  Password: admin123\n');
    console.log('Teachers (all):');
    console.log('  Email: teacher1-3@progress.edu');
    console.log('  Password: teacher123\n');
    console.log('Students (all):');
    console.log('  Email: student1-5@progress.edu');
    console.log('  Password: student123\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error seeding data:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seedDemoData();
