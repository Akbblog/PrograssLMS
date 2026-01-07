/**
 * 🕌 Seed Script: Complete Islamic School Demo
 * Creates a fully operational school with:
 * - 1 School Admin
 * - 10 Teachers with Islamic names
 * - 25 Students with Islamic names
 * - 5 Class Levels
 * - 6 Subjects
 * - Enrollments and sample data
 * 
 * Run: node backend/seed-islamic-school.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SCHOOL_ID = 'school-islamic-001';

// Islamic Names Database
const teachers = [
  { name: 'Muhammad Hassan Al-Rashid', email: 'hassan.rashid@islamic-school.edu', subject: 'Quranic Studies' },
  { name: 'Fatima Zahra Ahmed', email: 'fatima.ahmed@islamic-school.edu', subject: 'Islamic History' },
  { name: 'Ali ibn Omar', email: 'ali.omar@islamic-school.edu', subject: 'Mathematics' },
  { name: 'Aisha Malik Khan', email: 'aisha.khan@islamic-school.edu', subject: 'Arabic Language' },
  { name: 'Ibrahim Abdullah', email: 'ibrahim.abdullah@islamic-school.edu', subject: 'Science' },
  { name: 'Zainab Hussain', email: 'zainab.hussain@islamic-school.edu', subject: 'English Literature' },
  { name: 'Yousuf Rahman', email: 'yousuf.rahman@islamic-school.edu', subject: 'Islamic Ethics' },
  { name: 'Leila Nasrallah', email: 'leila.nasrallah@islamic-school.edu', subject: 'Geography' },
  { name: 'Khalid Al-Mansouri', email: 'khalid.mansouri@islamic-school.edu', subject: 'Physical Education' },
  { name: 'Noor Salim', email: 'noor.salim@islamic-school.edu', subject: 'Computer Science' }
];

const students = [
  // Grade 1 (5 students)
  { name: 'Amr Abdullah', email: 'amr.abdullah@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  { name: 'Layla Hassan', email: 'layla.hassan@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  { name: 'Tariq Ahmed', email: 'tariq.ahmed@islamic-school.edu', grade: 'Grade 1', section: 'B' },
  { name: 'Hana Ibrahim', email: 'hana.ibrahim@islamic-school.edu', grade: 'Grade 1', section: 'B' },
  { name: 'Karim Malik', email: 'karim.malik@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  
  // Grade 2 (5 students)
  { name: 'Nadia Rahman', email: 'nadia.rahman@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  { name: 'Bilal Khan', email: 'bilal.khan@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  { name: 'Maryam Ali', email: 'maryam.ali@islamic-school.edu', grade: 'Grade 2', section: 'B' },
  { name: 'Samir Nasri', email: 'samir.nasri@islamic-school.edu', grade: 'Grade 2', section: 'B' },
  { name: 'Rania Hassan', email: 'rania.hassan@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  
  // Grade 3 (5 students)
  { name: 'Omar Ibrahim', email: 'omar.ibrahim@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  { name: 'Samira Abdullah', email: 'samira.abdullah@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  { name: 'Zayn Ahmed', email: 'zayn.ahmed@islamic-school.edu', grade: 'Grade 3', section: 'B' },
  { name: 'Farah Malik', email: 'farah.malik@islamic-school.edu', grade: 'Grade 3', section: 'B' },
  { name: 'Hassan Al-Rashid', email: 'hassan.alrashid@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  
  // Grade 4 (5 students)
  { name: 'Yasmin Khan', email: 'yasmin.khan@islamic-school.edu', grade: 'Grade 4', section: 'A' },
  { name: 'Mustafa Rahman', email: 'mustafa.rahman@islamic-school.edu', grade: 'Grade 4', section: 'A' },
  { name: 'Dina Hassan', email: 'dina.hassan@islamic-school.edu', grade: 'Grade 4', section: 'B' },
  { name: 'Adnan Ahmed', email: 'adnan.ahmed@islamic-school.edu', grade: 'Grade 4', section: 'B' },
  { name: 'Sara Ali', email: 'sara.ali@islamic-school.edu', grade: 'Grade 4', section: 'A' },
  
  // Grade 5 (5 students)
  { name: 'Waleed Ibrahim', email: 'waleed.ibrahim@islamic-school.edu', grade: 'Grade 5', section: 'A' },
  { name: 'Huda Nasrallah', email: 'huda.nasrallah@islamic-school.edu', grade: 'Grade 5', section: 'A' },
  { name: 'Rashid Malik', email: 'rashid.malik@islamic-school.edu', grade: 'Grade 5', section: 'B' },
  { name: 'Lina Abdullah', email: 'lina.abdullah@islamic-school.edu', grade: 'Grade 5', section: 'B' },
  { name: 'Sami Khan', email: 'sami.khan@islamic-school.edu', grade: 'Grade 5', section: 'A' }
];

const subjects = [
  { name: 'Quranic Studies', code: 'QUR101' },
  { name: 'Islamic History', code: 'HIS201' },
  { name: 'Mathematics', code: 'MATH101' },
  { name: 'Arabic Language', code: 'ARA101' },
  { name: 'Science', code: 'SCI101' },
  { name: 'English Literature', code: 'ENG101' }
];

const classLevels = [
  { name: 'Grade 1', section: 'A' },
  { name: 'Grade 1', section: 'B' },
  { name: 'Grade 2', section: 'A' },
  { name: 'Grade 2', section: 'B' },
  { name: 'Grade 3', section: 'A' },
  { name: 'Grade 3', section: 'B' },
  { name: 'Grade 4', section: 'A' },
  { name: 'Grade 4', section: 'B' },
  { name: 'Grade 5', section: 'A' },
  { name: 'Grade 5', section: 'B' }
];

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function seed() {
  try {
    console.log('\n🕌 === Starting Islamic School Seed ===\n');

    // 1. Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.assignmentSubmission.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.feePayment.deleteMany({});
    await prisma.feeStructure.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.classLevel.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.school.deleteMany({});
    console.log('✅ Data cleared\n');

    // 2. Create School
    console.log('📚 Creating School...');
    const school = await prisma.school.create({
      data: {
        id: SCHOOL_ID,
        name: 'Al-Noor Islamic Academy',
        email: 'admin@alnoor-academy.edu',
        phone: '+1-800-ALNOOR-1',
        address: '123 Islamic Center Drive, Islamic District, IL 60601',
        features: JSON.stringify({
          quranStudies: true,
          islamicEthics: true,
          arabicLanguage: true,
          modernCurriculum: true,
          sportsActivities: true,
          afterSchoolPrograms: true
        })
      }
    });
    console.log(`✅ School created: ${school.name}\n`);

    // 3. Create School Admin
    console.log('👨‍💼 Creating School Admin...');
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.admin.create({
      data: {
        name: 'Dr. Muhammad Rashid',
        email: 'admin@alnoor-academy.edu',
        password: adminPassword,
        phone: '+1-800-ADMIN-01',
        role: 'admin',
        schoolId: SCHOOL_ID
      }
    });
    console.log(`✅ Admin created: ${admin.name}\n`);

    // 4. Create Class Levels
    console.log('🏫 Creating Class Levels...');
    const createdClassLevels = [];
    for (const classData of classLevels) {
      const classLevel = await prisma.classLevel.create({
        data: {
          name: classData.name,
          section: classData.section,
          schoolId: SCHOOL_ID
        }
      });
      createdClassLevels.push(classLevel);
    }
    console.log(`✅ Created ${createdClassLevels.length} class levels\n`);

    // 5. Create Subjects
    console.log('📖 Creating Subjects...');
    const createdSubjects = [];
    for (const subjectData of subjects) {
      const subject = await prisma.subject.create({
        data: {
          name: subjectData.name,
          code: subjectData.code,
          schoolId: SCHOOL_ID
        }
      });
      createdSubjects.push(subject);
    }
    console.log(`✅ Created ${createdSubjects.length} subjects\n`);

    // 6. Create Teachers
    console.log('👨‍🏫 Creating Teachers...');
    const teacherPassword = await hashPassword('password123');
    const createdTeachers = [];
    for (const teacherData of teachers) {
      const teacher = await prisma.teacher.create({
        data: {
          name: teacherData.name,
          email: teacherData.email,
          password: teacherPassword,
          firstName: teacherData.name.split(' ')[0],
          lastName: teacherData.name.split(' ').slice(1).join(' '),
          phone: `+1-555-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
          role: 'teacher',
          schoolId: SCHOOL_ID
        }
      });
      createdTeachers.push(teacher);
      console.log(`  ✅ ${teacher.name} (${teacherData.subject})`);
    }
    console.log(`\n✅ Created ${createdTeachers.length} teachers\n`);

    // 7. Create Students
    console.log('🎓 Creating Students...');
    const studentPassword = await hashPassword('password123');
    const createdStudents = [];
    for (let i = 0; i < students.length; i++) {
      const studentData = students[i];
      const student = await prisma.student.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          password: studentPassword,
          studentId: `STU-${String(i + 1).padStart(3, '0')}`,
          phone: `+1-555-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
          role: 'student',
          schoolId: SCHOOL_ID
        }
      });
      createdStudents.push(student);
      console.log(`  ✅ ${student.name} (${studentData.grade} ${studentData.section})`);
    }
    console.log(`\n✅ Created ${createdStudents.length} students\n`);

    // 8. Create Enrollments
    console.log('📝 Creating Student Enrollments...');
    let enrollmentCount = 0;
    for (const student of createdStudents) {
      // Find matching class level
      const matchingClass = createdClassLevels.find(cl => {
        const studentGrade = students.find(s => s.email === student.email)?.grade;
        const studentSection = students.find(s => s.email === student.email)?.section;
        return cl.name === studentGrade && cl.section === studentSection;
      });

      if (matchingClass) {
        // Enroll in 3-4 subjects
        const enrollmentSubjects = createdSubjects.slice(0, Math.floor(Math.random() * 2) + 3);
        for (const subject of enrollmentSubjects) {
          await prisma.enrollment.create({
            data: {
              studentId: student.id,
              subjectId: subject.id,
              classLevel: matchingClass.id,
              academicYear: '2025-2026',
              academicTerm: 'Term 1',
              status: 'active',
              progress: Math.floor(Math.random() * 100),
              schoolId: SCHOOL_ID
            }
          });
          enrollmentCount++;
        }
      }
    }
    console.log(`✅ Created ${enrollmentCount} enrollments\n`);

    // 9. Create Sample Assignments
    console.log('✏️  Creating Sample Assignments...');
    let assignmentCount = 0;
    for (let i = 0; i < 5; i++) {
      const randomTeacher = createdTeachers[Math.floor(Math.random() * createdTeachers.length)];
      const randomSubject = createdSubjects[Math.floor(Math.random() * createdSubjects.length)];
      const randomClass = createdClassLevels[Math.floor(Math.random() * createdClassLevels.length)];

      const assignment = await prisma.assignment.create({
        data: {
          title: `Assignment ${i + 1}: ${randomSubject.name} Task`,
          description: `Complete the ${randomSubject.name} assignment covering chapters 1-5. Submit by the due date.`,
          subjectId: randomSubject.id,
          classLevel: randomClass.id,
          teacherId: randomTeacher.id,
          dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
          totalPoints: 100,
          schoolId: SCHOOL_ID,
          academicYear: '2025-2026',
          academicTerm: 'Term 1'
        }
      });
      assignmentCount++;
      console.log(`  ✅ ${assignment.title}`);
    }
    console.log(`\n✅ Created ${assignmentCount} assignments\n`);

    // 10. Create Sample Attendance Records
    console.log('📋 Creating Sample Attendance Records...');
    let attendanceCount = 0;
    for (const classLevel of createdClassLevels.slice(0, 3)) {
      const classStudents = createdStudents.filter(s => {
        const studentData = students.find(sd => sd.email === s.email);
        return classLevel.name === studentData?.grade && classLevel.section === studentData?.section;
      });

      if (classStudents.length > 0) {
        const attendanceRecords = classStudents.map(s => ({
          studentId: s.id,
          name: s.name,
          status: Math.random() > 0.1 ? 'present' : 'absent'
        }));

        await prisma.attendance.create({
          data: {
            classLevel: classLevel.id,
            date: new Date(),
            records: JSON.stringify(attendanceRecords),
            academicYear: '2025-2026',
            academicTerm: 'Term 1',
            takenBy: createdTeachers[0].id,
            schoolId: SCHOOL_ID
          }
        });
        attendanceCount++;
      }
    }
    console.log(`✅ Created ${attendanceCount} attendance records\n`);

    // 11. Create Fee Payments
    console.log('💰 Creating Fee Payments...');
    let feeCount = 0;
    for (const student of createdStudents.slice(0, 10)) {
      const fee = await prisma.feePayment.create({
        data: {
          studentId: student.id,
          totalAmount: 5000,
          amountPaid: Math.random() > 0.3 ? 5000 : Math.floor(Math.random() * 3000),
          balanceDue: 0,
          status: Math.random() > 0.3 ? 'paid' : 'pending',
          paymentMethod: ['cash', 'online', 'check'][Math.floor(Math.random() * 3)],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          academicYear: '2025-2026',
          schoolId: SCHOOL_ID
        }
      });
      feeCount++;
    }
    console.log(`✅ Created ${feeCount} fee payment records\n`);

    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED COMPLETE - Islamic School Demo Data Created!');
    console.log('='.repeat(60) + '\n');

    console.log('📊 Summary:');
    console.log(`   🏫 School: ${school.name}`);
    console.log(`   👨‍💼 Admin: ${admin.name}`);
    console.log(`   👨‍🏫 Teachers: ${createdTeachers.length}`);
    console.log(`   🎓 Students: ${createdStudents.length}`);
    console.log(`   📚 Subjects: ${createdSubjects.length}`);
    console.log(`   🏛️  Class Levels: ${createdClassLevels.length}`);
    console.log(`   📝 Enrollments: ${enrollmentCount}`);
    console.log(`   ✏️  Assignments: ${assignmentCount}`);
    console.log(`   📋 Attendance Records: ${attendanceCount}`);
    console.log(`   💰 Fee Records: ${feeCount}\n`);

    console.log('🔐 Login Credentials:');
    console.log('   Admin Email: admin@alnoor-academy.edu');
    console.log('   Admin Password: admin123\n');
    console.log('   Teacher Email: hassan.rashid@islamic-school.edu');
    console.log('   Teacher Password: password123\n');
    console.log('   Student Email: amr.abdullah@islamic-school.edu');
    console.log('   Student Password: password123\n');

    console.log('🌟 Superadmin Email: SA@progresslms.com');
    console.log('🌟 Superadmin Password: Superpass\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
}

seed();
