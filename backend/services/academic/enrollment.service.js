// Enrollment service with optional Prisma delegation
if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
  module.exports = require('./enrollment.service.prisma_impl');
  return;
}

const Enrollment = require('../../models/Academic/Enrollment.model');

exports.createEnrollment = async (req, res) => {
  try {
    const { student, subject, classLevel, academicYear, academicTerm } = req.body;
    const schoolId = req.userAuth.schoolId;

    const enrollment = await Enrollment.create({ student, subject, classLevel, academicYear, academicTerm, schoolId });

    return res.status(201).json({ status: 'success', data: enrollment });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.userAuth.schoolId;

    const enrollments = await Enrollment.find({ student: studentId, schoolId, status: 'active' })
      .populate('subject', 'name description')
      .populate('classLevel', 'name')
      .populate('academicYear', 'name')
      .populate('academicTerm', 'name');

    return res.status(200).json({ status: 'success', data: enrollments });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, { progress }, { new: true });

    return res.status(200).json({ status: 'success', data: enrollment });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
