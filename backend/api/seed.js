/**
 * API Route: Seed Islamic School Data (Vercel-compatible)
 * Use: POST /api/seed with Authorization header containing SEED_SECRET
 * 
 * Security: Protected with SEED_SECRET environment variable
 * Usage: Only for initial setup/demo purposes
 */

import { createResponse } from '@/handlers/responseStatus.handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SCHOOL_ID = 'school-islamic-001';

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

export default async function handler(req, res) {
  // Security check
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, 'Method not allowed'));
  }

  const seedSecret = req.headers.authorization?.replace('Bearer ', '');
  const expectedSecret = process.env.SEED_SECRET || 'seed-secret-key';

  if (seedSecret !== expectedSecret) {
    return res.status(401).json(createResponse(false, 'Unauthorized - invalid seed secret'));
  }

  try {
    console.log('🕌 Starting Vercel Seed...');

    // Clear existing data
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

    // Create School
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

    // Create Admin
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

    // Create Class Levels
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

    // Create Subjects
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

    // Create Teachers
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
    }

    // Create Students
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
    }

    // Create Enrollments
    let enrollmentCount = 0;
    for (const student of createdStudents) {
      const matchingClass = createdClassLevels.find(cl => {
        const studentData = students.find(s => s.email === student.email);
        return cl.name === studentData?.grade && cl.section === studentData?.section;
      });

      if (matchingClass) {
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

    return res.status(200).json(
      createResponse(true, 'Database seeded successfully', {
        school: school.name,
        admin: admin.name,
        teachers: createdTeachers.length,
        students: createdStudents.length,
        subjects: createdSubjects.length,
        classLevels: createdClassLevels.length,
        enrollments: enrollmentCount
      })
    );
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json(createResponse(false, `Seed failed: ${error.message}`));
  }
}
