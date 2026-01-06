// Assignment service with optional Prisma delegation
if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
  module.exports = require('./assignment.service.prisma_impl');
  return;
}

const Assignment = require('../../models/Academic/Assignment.model');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subject, classLevel, dueDate, totalPoints, attachments, academicYear, academicTerm } = req.body;
    const schoolId = req.userAuth.schoolId;
    const teacher = req.userAuth._id;

    const assignment = await Assignment.create({ title, description, subject, classLevel, teacher, dueDate, totalPoints: totalPoints || 100, attachments, schoolId, academicYear, academicTerm });

    return res.status(201).json({ status: 'success', data: assignment });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { classLevel, subject, studentId } = req.query;
    const schoolId = req.userAuth.schoolId;

    let query = { schoolId };
    if (classLevel) query.classLevel = classLevel;
    if (subject) query.subject = subject;

    const assignments = await Assignment.find(query).populate('subject', 'name').populate('classLevel', 'name').populate('teacher', 'name').sort({ dueDate: -1 });

    if (studentId) {
      const assignmentsWithStatus = assignments.map((assignment) => {
        const submission = assignment.submissions.find((sub) => sub.student.toString() === studentId);
        return { ...assignment.toObject(), mySubmission: submission || null };
      });
      return res.status(200).json({ status: 'success', data: assignmentsWithStatus });
    }

    return res.status(200).json({ status: 'success', data: assignments });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content, fileUrl } = req.body;
    const studentId = req.userAuth._id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ status: 'fail', message: 'Assignment not found' });

    const existingSubmission = assignment.submissions.find((sub) => sub.student.toString() === studentId.toString());

    if (existingSubmission) {
      existingSubmission.content = content;
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = Date.now();
      existingSubmission.status = new Date() > assignment.dueDate ? 'late' : 'submitted';
    } else {
      assignment.submissions.push({ student: studentId, content, fileUrl, status: new Date() > assignment.dueDate ? 'late' : 'submitted' });
    }

    await assignment.save();

    return res.status(200).json({ status: 'success', message: 'Assignment submitted successfully', data: assignment });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { grade, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ status: 'fail', message: 'Assignment not found' });

    const submission = assignment.submissions.find((sub) => sub.student.toString() === studentId);
    if (!submission) return res.status(404).json({ status: 'fail', message: 'Submission not found' });

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';

    await assignment.save();

    return res.status(200).json({ status: 'success', message: 'Submission graded successfully', data: assignment });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
