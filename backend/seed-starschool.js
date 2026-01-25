/**
 * Seed Script: STAR SCHOOL Demo
 * - School name: STAR SCHOOL (English + Urdu)
 * - Admin: admin@starschool.com
 * - 5 Teachers
 * - 25 Students
 * - Creates class levels, subjects, enrollments, assignments, attendance, fees
 * - Creates a superadmin (superadmin@progresslms.com)
 *
 * Run: node backend/seed-starschool.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
console.log('Loaded backend/.env, DATABASE_URL (masked):', (process.env.DATABASE_URL || '').replace(/:(.*)@/, ':*****@'));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SCHOOL_ID = 'school-star-001';

const teachers = [
  { name: 'Ali Khan', email: 'ali.khan@starschool.com', subject: 'Mathematics' },
  { name: 'Sara Ahmed', email: 'sara.ahmed@starschool.com', subject: 'English' },
  { name: 'Usman Riaz', email: 'usman.riaz@starschool.com', subject: 'Science' },
  { name: 'Fatima Noor', email: 'fatima.noor@starschool.com', subject: 'Urdu' },
  { name: 'Owais Malik', email: 'owais.malik@starschool.com', subject: 'Social Studies' }
];

// 25 students (5 grades x 5)
const students = [];
for (let g = 1; g <= 5; g++) {
  for (let i = 1; i <= 5; i++) {
    const idx = (g - 1) * 5 + i;
    students.push({
      name: `Student ${idx} Star`,
      email: `student${idx}@starschool.com`,
      grade: `Grade ${g}`,
      section: i % 2 === 0 ? 'B' : 'A'
    });
  }
}

const subjects = [
  { name: 'Mathematics', code: 'MATH101' },
  { name: 'English', code: 'ENG101' },
  { name: 'Science', code: 'SCI101' },
  { name: 'Urdu', code: 'URD101' },
  { name: 'Social Studies', code: 'SOC101' }
];

const classLevels = [];
for (let g = 1; g <= 5; g++) {
  classLevels.push({ name: `Grade ${g}`, section: 'A' });
  classLevels.push({ name: `Grade ${g}`, section: 'B' });
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function seed() {
  try {
    console.log('\n🌟 Starting STAR SCHOOL Seed...\n');

    // Clear existing data for this demo
    console.log('🗑️ Clearing existing relevant data...');
    // Helper to safely delete from models that may not exist in the current schema
    async function safeDelete(accessor, name) {
      try {
        if (accessor && typeof accessor.deleteMany === 'function') {
          await accessor.deleteMany();
          console.log(`  deleted: ${name}`);
        } else {
          console.log(`  skip (no model): ${name}`);
        }
      } catch (err) {
        console.warn(`  could not clear ${name}:`, err.message || err);
      }
    }

    await safeDelete(prisma.assignmentSubmission, 'assignmentSubmission');
    await safeDelete(prisma.assignment, 'assignment');
    await safeDelete(prisma.enrollment, 'enrollment');
    await safeDelete(prisma.attendance, 'attendance');
    await safeDelete(prisma.feePayment, 'feePayment');
    await safeDelete(prisma.feeStructure, 'feeStructure');
    await safeDelete(prisma.subject, 'subject');
    await safeDelete(prisma.classLevel, 'classLevel');
    await safeDelete(prisma.student, 'student');
    await safeDelete(prisma.teacher, 'teacher');
    await safeDelete(prisma.admin, 'admin');
    await safeDelete(prisma.school, 'school');
    console.log('✅ Data cleared\n');

    // Create School
    console.log('🏫 Creating school...');
    const school = await prisma.school.create({
      data: {
        id: SCHOOL_ID,
        name: 'STAR SCHOOL — اسٹار اسکول',
        email: 'admin@starschool.com',
        phone: '+92-300-0000000',
        address: 'City Center, Near Main Road, Karachi, Pakistan',
        features: JSON.stringify({
          urduSupport: true,
          sports: true,
          library: true,
          transport: true
        })
      }
    });
    console.log(`✅ School created: ${school.name}\n`);

    // Create School Admin
    console.log('👨‍💼 Creating school admin...');
    const adminPasswordHashed = await hashPassword('admin123');
    const admin = await prisma.admin.create({
      data: {
        name: 'Star School Admin',
        email: 'admin@starschool.com',
        password: adminPasswordHashed,
        phone: '+92-300-1111111',
        role: 'admin',
        schoolId: SCHOOL_ID
      }
    });
    console.log(`✅ Admin created: ${admin.email} / password: admin123\n`);

    // Create Superadmin
    console.log('🦸 Creating superadmin...');
    const superPass = await hashPassword('Superpass');
    const sa = await prisma.admin.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@progresslms.com',
        password: superPass,
        role: 'super_admin'
      }
    });
    console.log('✅ Superadmin created: superadmin@progresslms.com / password: Superpass\n');

    // Create Class Levels
    console.log('🏷️ Creating class levels...');
    const createdClassLevels = [];
    for (const cl of classLevels) {
      const c = await prisma.classLevel.create({ data: { name: cl.name, section: cl.section, schoolId: SCHOOL_ID } });
      createdClassLevels.push(c);
    }
    console.log(`✅ Created ${createdClassLevels.length} class levels\n`);

    // Create Subjects
    console.log('📚 Creating subjects...');
    const createdSubjects = [];
    for (const s of subjects) {
      const subj = await prisma.subject.create({ data: { name: s.name, code: s.code, schoolId: SCHOOL_ID } });
      createdSubjects.push(subj);
    }
    console.log(`✅ Created ${createdSubjects.length} subjects\n`);

    // Create Teachers (5)
    console.log('👩‍🏫 Creating teachers...');
    const teacherPass = await hashPassword('teacher123');
    const createdTeachers = [];
    for (const t of teachers) {
      const teacher = await prisma.teacher.create({
        data: {
          name: t.name,
          email: t.email,
          password: teacherPass,
          firstName: t.name.split(' ')[0],
          lastName: t.name.split(' ').slice(1).join(' '),
          phone: `+92-${Math.floor(3000000000 + Math.random() * 8999999999)}`,
          role: 'teacher',
          schoolId: SCHOOL_ID
        }
      });
      createdTeachers.push(teacher);
      console.log(`  ✅ ${teacher.name}`);
    }
    console.log(`\n✅ Created ${createdTeachers.length} teachers\n`);

    // Create Students (25)
    console.log('🎒 Creating students...');
    const studentPass = await hashPassword('student123');
    const createdStudents = [];
    for (let i = 0; i < students.length; i++) {
      const sd = students[i];
      const student = await prisma.student.create({
        data: {
          name: sd.name,
          email: sd.email,
          password: studentPass,
          studentId: `STU-${String(i + 1).padStart(3, '0')}`,
          phone: `+92-3${String(Math.floor(10000000 + Math.random() * 89999999)).slice(0,8)}`,
          role: 'student',
          schoolId: SCHOOL_ID
        }
      });
      createdStudents.push(student);
      console.log(`  ✅ ${student.name} (${sd.grade} ${sd.section})`);
    }
    console.log(`\n✅ Created ${createdStudents.length} students\n`);

    // Enrollments
    console.log('📝 Creating enrollments...');
    let enrollmentCount = 0;
    for (const student of createdStudents) {
      // Determine student's grade/section from email
      const sMeta = students.find(s => s.email === student.email);
      const matchingClass = createdClassLevels.find(cl => cl.name === sMeta.grade && cl.section === sMeta.section);
      if (!matchingClass) continue;
      const enrollSubjects = createdSubjects.slice(0, 3);
      for (const subj of enrollSubjects) {
        await prisma.enrollment.create({ data: {
          studentId: student.id,
          subjectId: subj.id,
          classLevel: matchingClass.id,
          academicYear: '2025-2026',
          academicTerm: 'Term 1',
          status: 'active',
          progress: Math.floor(Math.random() * 100),
          schoolId: SCHOOL_ID
        } });
        enrollmentCount++;
      }
    }
    console.log(`✅ Created ${enrollmentCount} enrollments\n`);

    // Assignments
    console.log('✏️ Creating assignments...');
    let assignmentCount = 0;
    for (let i = 0; i < 5; i++) {
      const randomTeacher = createdTeachers[Math.floor(Math.random() * createdTeachers.length)];
      const randomSubject = createdSubjects[Math.floor(Math.random() * createdSubjects.length)];
      const randomClass = createdClassLevels[Math.floor(Math.random() * createdClassLevels.length)];
      await prisma.assignment.create({ data: {
        title: `Assignment ${i + 1} - ${randomSubject.name}`,
        description: `Complete tasks for ${randomSubject.name}`,
        subjectId: randomSubject.id,
        classLevel: randomClass.id,
        teacherId: randomTeacher.id,
        dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
        totalPoints: 100,
        schoolId: SCHOOL_ID,
        academicYear: '2025-2026',
        academicTerm: 'Term 1'
      } });
      assignmentCount++;
    }
    console.log(`✅ Created ${assignmentCount} assignments\n`);

    // Attendance
    console.log('📋 Creating attendance records...');
    let attendanceCount = 0;
    for (const cl of createdClassLevels.slice(0, 4)) {
      const classStudents = createdStudents.filter(s => {
        const meta = students.find(sd => sd.email === s.email);
        return meta && meta.grade === cl.name && meta.section === cl.section;
      });
      const records = classStudents.map(s => ({ studentId: s.id, name: s.name, status: Math.random() > 0.1 ? 'present' : 'absent' }));
      await prisma.attendance.create({ data: {
        classLevel: cl.id,
        date: new Date(),
        records: JSON.stringify(records),
        academicYear: '2025-2026',
        academicTerm: 'Term 1',
        takenBy: createdTeachers[0].id,
        schoolId: SCHOOL_ID
      } });
      attendanceCount++;
    }
    console.log(`✅ Created ${attendanceCount} attendance records\n`);

    // Fee Structures and Payments
    console.log('💰 Creating fee records...');
    const feeStructure = await prisma.feeStructure.create({ data: {
      name: 'Standard Fees 2025',
      academicYear: '2025-2026',
      feeCategories: JSON.stringify([{ name: 'Tuition', amount: 5000 }, { name: 'Books', amount: 500 }]),
      status: 'active',
      schoolId: SCHOOL_ID
    } });

    let feeCount = 0;
    for (const s of createdStudents.slice(0, 10)) {
      await prisma.feePayment.create({ data: {
        studentId: s.id,
        totalAmount: 5500,
        amountPaid: Math.random() > 0.4 ? 5500 : Math.floor(Math.random() * 4000),
        balanceDue: 0,
        status: Math.random() > 0.4 ? 'paid' : 'pending',
        paymentMethod: ['cash','online','bank'][Math.floor(Math.random()*3)],
        dueDate: new Date(Date.now() + 30*24*60*60*1000),
        academicYear: '2025-2026',
        schoolId: SCHOOL_ID
      } });
      feeCount++;
    }
    console.log(`✅ Created ${feeCount} fee payments\n`);

    // Exams & Results (safe)
    console.log('🏆 Creating exams and results (if models exist)...');
    try {
      if (prisma.exam && typeof prisma.exam.create === 'function') {
        const createdExams = [];
        for (let i = 1; i <= 3; i++) {
          const ex = await prisma.exam.create({ data: {
            title: `Term ${i} Exam 2025`,
            examDate: new Date(Date.now() + i * 14 * 24 * 60 * 60 * 1000),
            academicYear: '2025-2026',
            academicTerm: `Term ${i}`,
            schoolId: SCHOOL_ID
          } });
          createdExams.push(ex);
        }

        let resultCount = 0;
        if (prisma.result && typeof prisma.result.create === 'function') {
          for (const enr of await prisma.enrollment.findMany({ where: { schoolId: SCHOOL_ID } })) {
            const score = Math.floor(Math.random() * 100);
            await prisma.result.create({ data: {
              studentId: enr.studentId,
              subjectId: enr.subjectId,
              examId: createdExams[Math.floor(Math.random() * createdExams.length)].id,
              marksObtained: score,
              totalMarks: 100,
              grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D',
              academicYear: enr.academicYear,
              schoolId: SCHOOL_ID
            } });
            resultCount++;
          }
        }
        console.log(`✅ Created ${createdExams.length} exams and ${resultCount} results (if models exist)`);
      } else {
        console.log('  skip: exam model not found in prisma schema');
      }
      
      // Create additional results for grades API
      console.log('📊 Creating additional grade records...');
      let gradeCount = 0;
      if (prisma.result && typeof prisma.result.create === 'function') {
        for (const student of createdStudents.slice(0, 10)) {
          const score = Math.floor(Math.random() * 100);
          await prisma.result.create({ data: {
            studentId: student.id,
            examName: 'Mathematics Midterm',
            score: score,
            grade: score >= 85 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C' : 'D',
            passMark: 60,
            status: 'graded',
            remarks: 'Good performance',
            classLevel: createdClassLevels[0].id,
            academicTerm: 'Term 1',
            academicYear: '2025-2026',
            isPublished: true,
            schoolId: SCHOOL_ID
          } });
          gradeCount++;
        }
        console.log(`✅ Created ${gradeCount} additional grade records`);
      }
    } catch (err) {
      console.warn('  could not create exams/results:', err.message || err);
    }

    // Library (books) - safe
    console.log('📚 Creating library records (if model exists)...');
    try {
      if (prisma.libraryBook && typeof prisma.libraryBook.create === 'function') {
        const books = [
          { title: 'Mathematics Basics', isbn: 'ISBN-001' },
          { title: 'English Literature', isbn: 'ISBN-002' },
          { title: 'Introduction to Science', isbn: 'ISBN-003' }
        ];
        let bookCount = 0;
        for (const b of books) {
          await prisma.libraryBook.create({ data: { title: b.title, isbn: b.isbn, schoolId: SCHOOL_ID } });
          bookCount++;
        }
        console.log(`✅ Created ${bookCount} library books`);
      } else {
        console.log('  skip: libraryBook model not found');
      }
    } catch (err) {
      console.warn('  could not create library records:', err.message || err);
    }

    // Transport routes & assignments - safe
    console.log('🚍 Creating transport records (if model exists)...');
    try {
      if (prisma.transportRoute && typeof prisma.transportRoute.create === 'function') {
        const route = await prisma.transportRoute.create({ data: {
          name: 'Route A',
          vehicleNumber: 'BUS-01',
          capacity: 30,
          schoolId: SCHOOL_ID
        } });
        // assign first few students to route if assignment model exists
        if (prisma.transportAssignment && typeof prisma.transportAssignment.create === 'function') {
          let assignCount = 0;
          for (const s of createdStudents.slice(0, 10)) {
            await prisma.transportAssignment.create({ data: { studentId: s.id, routeId: route.id, schoolId: SCHOOL_ID } });
            assignCount++;
          }
          console.log(`✅ Transport route created and ${assignCount} assignments added`);
        } else {
          console.log('  route created but transportAssignment model not found');
        }
      } else {
        console.log('  skip: transportRoute model not found');
      }
    } catch (err) {
      console.warn('  could not create transport records:', err.message || err);
    }

    // Documents (student files) - safe
    console.log('📁 Creating document records (if model exists)...');
    try {
      if (prisma.document && typeof prisma.document.create === 'function') {
        let docCount = 0;
        for (const s of createdStudents.slice(0, 5)) {
          await prisma.document.create({ data: {
            title: `Admission Form - ${s.name}`,
            type: 'admission',
            uploadedBy: admin.id,
            studentId: s.id,
            schoolId: SCHOOL_ID
          } });
          docCount++;
        }
        console.log(`✅ Created ${docCount} documents`);
      } else {
        console.log('  skip: document model not found');
      }
    } catch (err) {
      console.warn('  could not create documents:', err.message || err);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 STAR SCHOOL Seed Complete!');
    console.log('='.repeat(60) + '\n');
    console.log('📊 Summary:');
    console.log(`  🏫 School: ${school.name}`);
    console.log(`  👨‍💼 Admin: ${admin.email} (password: admin123)`);
    console.log(`  🦸 Superadmin: ${sa.email} (password: Superpass)`);
    console.log(`  👩‍🏫 Teachers: ${createdTeachers.length}`);
    console.log(`  🎓 Students: ${createdStudents.length}`);
    console.log(`  📚 Subjects: ${createdSubjects.length}`);
    console.log(`  📝 Enrollments: ${enrollmentCount}`);
    console.log(`  ✏️ Assignments: ${assignmentCount}`);
    console.log(`  📋 Attendance Records: ${attendanceCount}`);
    console.log(`  💰 Fee Records: ${feeCount}\n`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();