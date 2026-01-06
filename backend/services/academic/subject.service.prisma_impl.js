const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Admin = require('../../models/Staff/admin.model');
const Program = require('../../models/Academic/program.model');
const responseStatus = require('../../handlers/responseStatus.handler');

exports.createSimpleSubjectService = async (data, userId, res) => {
  const { name, description } = data;
  const admin = await Admin.findById(userId);
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject already exists');
  const created = await prisma.subject.create({ data: { name, description: description || null, schoolId: String(schoolId) } });
  return responseStatus(res, 201, 'success', created);
};

exports.createSubjectService = async (data, programId, userId, res) => {
  const { name, description, academicTerm } = data;
  const admin = await Admin.findById(userId);
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';
  const programFound = await Program.findById(programId);
  if (!programFound) return responseStatus(res, 404, 'failed', 'Program not found');
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId) } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject already exists');
  const created = await prisma.subject.create({ data: { name, description: description || null, academicTerm: academicTerm || null, program: String(programId), schoolId: String(schoolId) } });
  // push to program (mongoose)
  programFound.subjects.push(created.id);
  await programFound.save();
  return responseStatus(res, 201, 'success', created);
};

exports.getAllSubjectsService = async (schoolId) => {
  const where = schoolId ? { schoolId: String(schoolId) } : {};
  const subjects = await prisma.subject.findMany({ where });
  // best-effort: attach teacher info by querying teachers with matching subject ids
  return subjects;
};

exports.getSubjectsService = async (id) => {
  return await prisma.subject.findUnique({ where: { id } });
};

exports.updateSubjectService = async (data, id, userId, res) => {
  const { name, description, academicTerm } = data;
  const admin = await Admin.findById(userId);
  if (!admin) return responseStatus(res, 401, 'failed', 'Admin not found');
  const schoolId = admin.schoolId;
  const exists = await prisma.subject.findFirst({ where: { name, schoolId: String(schoolId), NOT: { id } } });
  if (exists) return responseStatus(res, 400, 'failed', 'Subject name already exists');
  const updated = await prisma.subject.update({ where: { id }, data: { name, description: description || null, academicTerm: academicTerm || null } });
  return responseStatus(res, 200, 'success', updated);
};

exports.deleteSubjectService = async (id) => {
  return await prisma.subject.delete({ where: { id } });
};
