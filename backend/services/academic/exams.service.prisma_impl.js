const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.createExamService = async (data, userId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const { name, description, subject, program, passMark, totalMark, academicTerm, duration, examDate, examTime, classLevel, questions } = data;
  
  // Try to find user as teacher first, then admin
  let user = await prisma.teacher.findUnique({ where: { id: userId } });
  let userRole = 'teacher';
  if (!user) { 
    user = await prisma.admin.findUnique({ where: { id: userId } }); 
    userRole = 'admin'; 
  }
  if (!user) return responseStatus(res, 404, 'failed', 'User not found');
  if (!user.schoolId) return responseStatus(res, 400, 'failed', 'User does not belong to a school');
  
  const exists = await prisma.exam.findFirst({ where: { name, schoolId: String(user.schoolId) } });
  if (exists) return responseStatus(res, 402, 'failed', 'Exam with this name already exists in your school');
  
  const created = await prisma.exam.create({ data: { 
    name, 
    description: description || null, 
    subject: subject || null, 
    passMark: passMark || null, 
    totalMark: totalMark || null, 
    academicTerm: academicTerm || null, 
    duration: duration || null, 
    examDate: examDate ? new Date(examDate) : null, 
    examTime: examTime || null, 
    classLevel: classLevel || null, 
    questions: questions ? JSON.stringify(questions) : null, 
    createdBy: String(user.id), 
    schoolId: String(user.schoolId) 
  }});
  
  return responseStatus(res, 201, 'success', created);
};

exports.getAllExamService = async (filters = {}) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  // If schoolId provided in filters, apply
  const where = {};
  if (filters.schoolId) where.schoolId = String(filters.schoolId);
  return await prisma.exam.findMany({ where, orderBy: { createdAt: 'desc' } });
};

exports.getExamByIdService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  return await prisma.exam.findUnique({ where: { id } });
};

exports.updateExamService = async (data, examId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  if (data.name) {
    const found = await prisma.exam.findFirst({ where: { name: data.name, NOT: { id: examId } } });
    if (found) return responseStatus(res, 402, 'failed', 'Exam with this name already exists');
  }
  const update = { ...data };
  if (data.questions) update.questions = JSON.stringify(data.questions);
  if (data.examDate) update.examDate = new Date(data.examDate);
  const updated = await prisma.exam.update({ where: { id: examId }, data: update });
  return responseStatus(res, 200, 'success', updated);
};
