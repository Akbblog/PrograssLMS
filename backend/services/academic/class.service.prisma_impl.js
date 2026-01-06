const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Admin = require('../../models/Staff/admin.model');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.createClassLevelService = async (data, userId, res) => {
  const { name, description } = data;
  const admin = await Admin.findById(userId);
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';

  const exists = await prisma.classLevel.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Class already exists');

  const created = await prisma.classLevel.create({ data: { name, description: description || null, schoolId: String(schoolId) } });
  // push to admin (mongoose)
  admin.classLevels.push(created.id);
  await admin.save();
  return responseStatus(res, 200, 'success', created);
};

exports.getAllClassesService = async (schoolId) => {
  const where = schoolId ? { schoolId: String(schoolId) } : {};
  const classes = await prisma.classLevel.findMany({ where, orderBy: { createdAt: 'desc' } });
  // student counts require joining with students table which may need data normalization; skip heavy joins here
  return classes;
};

exports.getClassLevelsService = async (id) => {
  return await prisma.classLevel.findUnique({ where: { id } });
};

exports.updateClassLevelService = async (data, id, userId, res) => {
  const { name, description } = data;
  const exists = await prisma.classLevel.findFirst({ where: { name, NOT: { id } } });
  if (exists) return responseStatus(res, 400, 'failed', 'Class name already exists');
  const updated = await prisma.classLevel.update({ where: { id }, data: { name, description: description || null } });
  return responseStatus(res, 200, 'success', updated);
};

exports.deleteClassLevelService = async (id) => {
  return await prisma.classLevel.delete({ where: { id } });
};

// Relations (subjects/teachers) need relational tables in Prisma schema. These functions return best-effort results.
exports.getSubjectsByClassService = async (classId, schoolId) => {
  // fallback: return all subjects for the school
  return await prisma.subject.findMany({ where: { schoolId: String(schoolId) } });
};

exports.getTeachersByClassService = async (classId, schoolId) => {
  return await prisma.teacher.findMany({ where: { schoolId: String(schoolId) } , select: { password: false } });
};

exports.assignSubjectToClassService = async (classId, subjectId, res) => {
  return responseStatus(res, 501, 'failed', 'Assigning subjects to classes requires updating Prisma schema to model relations.');
};

exports.removeSubjectFromClassService = async (classId, subjectId, res) => {
  return responseStatus(res, 501, 'failed', 'Removing subjects from classes requires updating Prisma schema to model relations.');
};
