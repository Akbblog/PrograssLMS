const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.createClassLevelService = async (data, userId, res) => {
  const { name, description } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  
  // Get admin from Prisma
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';

  const exists = await prisma.classLevel.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Class already exists');

  const created = await prisma.classLevel.create({ data: { name, section: null, schoolId: String(schoolId) } });
  return responseStatus(res, 200, 'success', created);
};

exports.getAllClassesService = async (schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const where = schoolId ? { schoolId: String(schoolId) } : {};
  const classes = await prisma.classLevel.findMany({ where, orderBy: { createdAt: 'desc' } });
  return classes;
};

exports.getClassLevelsService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  return await prisma.classLevel.findUnique({ where: { id } });
};

exports.updateClassLevelService = async (data, id, userId, res) => {
  const { name, description } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const exists = await prisma.classLevel.findFirst({ where: { name, NOT: { id } } });
  if (exists) return responseStatus(res, 400, 'failed', 'Class name already exists');
  const updated = await prisma.classLevel.update({ where: { id }, data: { name, description: description || null } });
  return responseStatus(res, 200, 'success', updated);
};

exports.deleteClassLevelService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  return await prisma.classLevel.delete({ where: { id } });
};

// Relations (subjects/teachers) need relational tables in Prisma schema. These functions return best-effort results.
exports.getSubjectsByClassService = async (classId, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  // fallback: return all subjects for the school
  return await prisma.subject.findMany({ where: { schoolId: String(schoolId) } });
};

exports.getTeachersByClassService = async (classId, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const teachers = await prisma.teacher.findMany({ where: { schoolId: String(schoolId) } });
  // Remove passwords from results
  return teachers.map(t => { const { password, ...rest } = t; return rest; });
};

exports.assignSubjectToClassService = async (classId, subjectId, res) => {
  return responseStatus(res, 501, 'failed', 'Assigning subjects to classes requires updating Prisma schema to model relations.');
};

exports.removeSubjectFromClassService = async (classId, subjectId, res) => {
  return responseStatus(res, 501, 'failed', 'Removing subjects from classes requires updating Prisma schema to model relations.');
};
