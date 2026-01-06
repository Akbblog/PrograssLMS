const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createEnrollment = async (req, res) => {
  try {
    const { student, subject, classLevel, academicYear, academicTerm } = req.body;
    const schoolId = req.userAuth.schoolId;

    const enrollment = await prisma.enrollment.create({ data: { studentId: student, subjectId: subject, classLevel, academicYear, academicTerm, schoolId } });

    return res.status(201).json({ status: 'success', data: enrollment });
  } catch (err) {
    console.error('[Prisma][Enrollment] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.userAuth.schoolId;

    const enrollments = await prisma.enrollment.findMany({ where: { studentId, schoolId, status: 'active' }, include: { subject: true, classLevelObj: true, academicYear: true, academicTerm: true } });

    return res.status(200).json({ status: 'success', data: enrollments });
  } catch (err) {
    console.error('[Prisma][Enrollment] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await prisma.enrollment.update({ where: { id: enrollmentId }, data: { progress } });
    return res.status(200).json({ status: 'success', data: enrollment });
  } catch (err) {
    console.error('[Prisma][Enrollment] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
