const { getPrisma } = require('../../lib/prismaClient');

exports.createAssignment = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { title, description, subject, classLevel, dueDate, totalPoints, attachments, academicYear, academicTerm } = req.body;
    const schoolId = req.userAuth.schoolId;
    const teacher = req.userAuth._id;

    const assignment = await prisma.assignment.create({ data: { title, description, subjectId: subject, classLevel, teacherId: teacher, dueDate: new Date(dueDate), totalPoints: totalPoints || 100, attachments: JSON.stringify(attachments || []), schoolId, academicYear, academicTerm } });

    return res.status(201).json({ status: 'success', data: assignment });
  } catch (err) {
    console.error('[Prisma][Assignment] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { classLevel, subject, studentId } = req.query;
    const schoolId = req.userAuth.schoolId;

    const where = { schoolId };
    if (classLevel) where.classLevel = classLevel;
    if (subject) where.subjectId = subject;

    const assignments = await prisma.assignment.findMany({ where, orderBy: { dueDate: 'desc' } });

    if (studentId) {
      // Attach submission status by querying submissions table if exists
      const withStatus = [];
      for (const a of assignments) {
        const submission = await prisma.assignmentSubmission.findFirst({ where: { assignmentId: a.id, studentId } });
        withStatus.push({ ...a, mySubmission: submission || null });
      }
      return res.status(200).json({ status: 'success', data: withStatus });
    }

    return res.status(200).json({ status: 'success', data: assignments });
  } catch (err) {
    console.error('[Prisma][Assignment] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { assignmentId } = req.params;
    const { content, fileUrl } = req.body;
    const studentId = req.userAuth._id;

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ status: 'fail', message: 'Assignment not found' });

    const existing = await prisma.assignmentSubmission.findFirst({ where: { assignmentId, studentId } });
    const status = new Date() > new Date(assignment.dueDate) ? 'late' : 'submitted';

    if (existing) {
      const updated = await prisma.assignmentSubmission.update({ where: { id: existing.id }, data: { content, fileUrl, submittedAt: new Date(), status } });
      return res.status(200).json({ status: 'success', message: 'Assignment submitted successfully', data: updated });
    }

    const created = await prisma.assignmentSubmission.create({ data: { assignmentId, studentId, content, fileUrl, submittedAt: new Date(), status } });
    return res.status(200).json({ status: 'success', message: 'Assignment submitted successfully', data: created });
  } catch (err) {
    console.error('[Prisma][Assignment] submit error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { assignmentId, studentId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await prisma.assignmentSubmission.findFirst({ where: { assignmentId, studentId } });
    if (!submission) return res.status(404).json({ status: 'fail', message: 'Submission not found' });

    const updated = await prisma.assignmentSubmission.update({ where: { id: submission.id }, data: { grade, feedback, status: 'graded' } });
    return res.status(200).json({ status: 'success', message: 'Submission graded successfully', data: updated });
  } catch (err) {
    console.error('[Prisma][Assignment] grade error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
