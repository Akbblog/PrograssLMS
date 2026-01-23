/**
 * Seed Router - Populate database with Islamic school demo data
 * Endpoint: POST /api/v1/seed
 * Security: Protected with SEED_SECRET environment variable
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getPrisma } = require('../../lib/prismaClient');

const SCHOOL_ID = 'school-islamic-001';

// Middleware to verify seed secret
const verifySeedSecret = (req, res, next) => {
  const seedSecret = req.headers.authorization?.replace('Bearer ', '');
  const expectedSecret = process.env.SEED_SECRET || 'seed-secret-key';

  if (seedSecret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - invalid seed secret'
    });
  }
  next();
};

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
  { name: 'Amr Abdullah', email: 'amr.abdullah@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  { name: 'Layla Hassan', email: 'layla.hassan@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  { name: 'Tariq Ahmed', email: 'tariq.ahmed@islamic-school.edu', grade: 'Grade 1', section: 'B' },
  { name: 'Hana Ibrahim', email: 'hana.ibrahim@islamic-school.edu', grade: 'Grade 1', section: 'B' },
  { name: 'Karim Malik', email: 'karim.malik@islamic-school.edu', grade: 'Grade 1', section: 'A' },
  { name: 'Nadia Rahman', email: 'nadia.rahman@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  { name: 'Bilal Khan', email: 'bilal.khan@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  { name: 'Maryam Ali', email: 'maryam.ali@islamic-school.edu', grade: 'Grade 2', section: 'B' },
  { name: 'Samir Nasri', email: 'samir.nasri@islamic-school.edu', grade: 'Grade 2', section: 'B' },
  { name: 'Rania Hassan', email: 'rania.hassan@islamic-school.edu', grade: 'Grade 2', section: 'A' },
  { name: 'Omar Ibrahim', email: 'omar.ibrahim@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  { name: 'Samira Abdullah', email: 'samira.abdullah@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  { name: 'Zayn Ahmed', email: 'zayn.ahmed@islamic-school.edu', grade: 'Grade 3', section: 'B' },
  { name: 'Farah Malik', email: 'farah.malik@islamic-school.edu', grade: 'Grade 3', section: 'B' },
  { name: 'Hassan Al-Rashid', email: 'hassan.alrashid@islamic-school.edu', grade: 'Grade 3', section: 'A' },
  { name: 'Yasmin Khan', email: 'yasmin.khan@islamic-school.edu', grade: 'Grade 4', section: 'A' },
  { name: 'Mustafa Rahman', email: 'mustafa.rahman@islamic-school.edu', grade: 'Grade 4', section: 'A' },
  { name: 'Dina Hassan', email: 'dina.hassan@islamic-school.edu', grade: 'Grade 4', section: 'B' },
  { name: 'Adnan Ahmed', email: 'adnan.ahmed@islamic-school.edu', grade: 'Grade 4', section: 'B' },
  { name: 'Sara Ali', email: 'sara.ali@islamic-school.edu', grade: 'Grade 4', section: 'A' },
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

// Seed endpoint
router.post('/seed', verifySeedSecret, async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ success: false, message: 'Database connection failed' });

    const STAR_ID = 'school-star-001';

    // Safe delete helper to avoid failing on missing models
    async function safeDelete(accessor, name) {
      try {
        if (accessor && typeof accessor.deleteMany === 'function') {
          await accessor.deleteMany();
        }
      } catch (err) {
        console.warn(`Could not clear ${name}:`, err.message || err);
      }
    }

    // Clear relevant data
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

    // STAR SCHOOL data
    const school = await prisma.school.create({
      data: {
        id: STAR_ID,
        name: 'STAR SCHOOL — اسٹار اسکول',
        email: 'admin@starschool.com',
        phone: '+92-300-0000000',
        address: 'City Center, Near Main Road, Karachi, Pakistan',
        features: JSON.stringify({ urduSupport: true, sports: true, library: true, transport: true })
      }
    });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const admin = await prisma.admin.create({ data: { name: 'Star School Admin', email: 'admin@starschool.com', password: adminPassword, phone: '+92-300-1111111', role: 'admin', schoolId: STAR_ID } });

    // create superadmin
    const superHash = await bcrypt.hash('Superpass', salt);
    await prisma.admin.create({ data: { name: 'Super Admin', email: 'superadmin@progresslms.com', password: superHash, role: 'super_admin' } });

    // class levels
    const classLevels = [];
    for (let g = 1; g <= 5; g++) { classLevels.push({ name: `Grade ${g}`, section: 'A' }); classLevels.push({ name: `Grade ${g}`, section: 'B' }); }
    const createdClassLevels = [];
    for (const cl of classLevels) createdClassLevels.push(await prisma.classLevel.create({ data: { name: cl.name, section: cl.section, schoolId: STAR_ID } }));

    // subjects
    const subjects = [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'English', code: 'ENG101' },
      { name: 'Science', code: 'SCI101' },
      { name: 'Urdu', code: 'URD101' },
      { name: 'Social Studies', code: 'SOC101' }
    ];
    const createdSubjects = [];
    for (const s of subjects) createdSubjects.push(await prisma.subject.create({ data: { name: s.name, code: s.code, schoolId: STAR_ID } }));

    // teachers
    const teachers = [
      { name: 'Ali Khan', email: 'ali.khan@starschool.com' },
      { name: 'Sara Ahmed', email: 'sara.ahmed@starschool.com' },
      { name: 'Usman Riaz', email: 'usman.riaz@starschool.com' },
      { name: 'Fatima Noor', email: 'fatima.noor@starschool.com' },
      { name: 'Owais Malik', email: 'owais.malik@starschool.com' }
    ];
    const teacherHash = await bcrypt.hash('teacher123', salt);
    const createdTeachers = [];
    for (const t of teachers) createdTeachers.push(await prisma.teacher.create({ data: { name: t.name, email: t.email, password: teacherHash, firstName: t.name.split(' ')[0], lastName: t.name.split(' ').slice(1).join(' '), phone: '+92-300-0000000', role: 'teacher', schoolId: STAR_ID } }));

    // students
    const students = [];
    for (let g = 1; g <= 5; g++) for (let i = 1; i <= 5; i++) { const idx = (g - 1) * 5 + i; students.push({ name: `Student ${idx} Star`, email: `student${idx}@starschool.com`, grade: `Grade ${g}`, section: i % 2 === 0 ? 'B' : 'A' }); }
    const studentHash = await bcrypt.hash('student123', salt);
    const createdStudents = [];
    for (let i = 0; i < students.length; i++) {
      const sd = students[i];
      createdStudents.push(await prisma.student.create({ data: { name: sd.name, email: sd.email, password: studentHash, studentId: `STU-${String(i + 1).padStart(3,'0')}`, phone: '+92-300-0000000', role: 'student', schoolId: STAR_ID } }));
    }

    // enrollments
    let enrollmentCount = 0;
    for (const s of createdStudents) {
      const meta = students.find(x => x.email === s.email);
      const matchingClass = createdClassLevels.find(cl => cl.name === meta.grade && cl.section === meta.section);
      if (!matchingClass) continue;
      const enrollSubjects = createdSubjects.slice(0,3);
      for (const subj of enrollSubjects) {
        await prisma.enrollment.create({ data: { studentId: s.id, subjectId: subj.id, classLevel: matchingClass.id, academicYear: '2025-2026', academicTerm: 'Term 1', status: 'active', progress: Math.floor(Math.random()*100), schoolId: STAR_ID } });
        enrollmentCount++;
      }
    }

    // assignments, attendance, fees can be left minimal or added similarly if desired

    return res.status(200).json({ success: true, message: 'STAR SCHOOL seeded successfully', data: { school: school.name, admin: admin.email, teachers: createdTeachers.length, students: createdStudents.length, subjects: createdSubjects.length, classLevels: createdClassLevels.length, enrollments: enrollmentCount } });
  } catch (error) {
    console.error('Seed error:', error.message || error);
    return res.status(500).json({ success: false, message: `Seed failed: ${error.message || error}` });
  }
});

module.exports = router;
