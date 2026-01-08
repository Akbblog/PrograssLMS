const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.createSimpleSubjectService = async (data, userId, res) => {
  const { name, description } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  
  // Get admin from Prisma
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';
  
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject already exists');
  const created = await prisma.subject.create({ data: { name, code: null, schoolId: String(schoolId) } });
  return responseStatus(res, 201, 'success', created);
};

exports.createSubjectService = async (data, programId, userId, res) => {
  const { name, description, academicTerm } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  
  // Get admin from Prisma
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';
  
  // Program lookup - stub since Program table doesn't exist in Prisma schema
  // Just create the subject without program association
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject already exists');
  const created = await prisma.subject.create({ data: { name, code: null, schoolId: String(schoolId) } });
  return responseStatus(res, 201, 'success', created);
};

exports.getAllSubjectsService = async (schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const where = schoolId ? { schoolId: String(schoolId) } : {};
  const subjects = await prisma.subject.findMany({ where });
  return subjects;
};

exports.getSubjectsService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  return await prisma.subject.findUnique({ where: { id } });
};

exports.updateSubjectService = async (data, id, userId, res) => {
  const { name, description, academicTerm } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  
  // Get admin from Prisma
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId;
  
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId), NOT: { id } } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject name already exists');
  const updated = await prisma.subject.update({ where: { id }, data: { name, code: null } });
  return responseStatus(res, 200, 'success', updated);
};

exports.deleteSubjectService = async (id) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  return await prisma.subject.delete({ where: { id } });
};
