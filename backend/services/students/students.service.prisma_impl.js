const { getPrisma } = require('../../lib/prismaClient');
const { hashPassword, isPassMatched } = require('../../handlers/passHash.handler');
const responseStatus = require('../../handlers/responseStatus.handler');
const generateToken = require('../../utils/tokenGenerator');

exports.adminRegisterStudentService = async (data, adminId, res) => {
  const { name, email, password, schoolId } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  // find admin's schoolId if not provided
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  const sid = schoolId || (admin && admin.schoolId) || 'SCHOOL-IMPORT-1';

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) return responseStatus(res, 400, 'failed', 'Student with this email already exists');
  const hashedPassword = await hashPassword(password || Math.random().toString(36).slice(2,10));
  const created = await prisma.student.create({ data: { name, email, password: hashedPassword, schoolId: sid } });
  return responseStatus(res, 201, 'success', created);
};

exports.studentLoginService = async (data, res) => {
  const { email, password } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) return responseStatus(res, 401, 'failed', 'Invalid login credentials');
  const matched = await isPassMatched(password, student.password);
  if (!matched) return responseStatus(res, 401, 'failed', 'Invalid login credentials');
  const { password: pw, ...studentData } = student;
  const token = generateToken(student.id, student.role || 'student', student.schoolId);
  return responseStatus(res, 200, 'success', { student: studentData, token });
};

exports.getStudentsProfileService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return responseStatus(res, 402, 'failed', 'Student not found');
  // remove password
  delete student.password;
  return responseStatus(res, 200, 'success', student);
};

exports.getAllStudentsByAdminService = async (schoolId, filters = {}, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const where = {};
  if (schoolId) where.schoolId = schoolId;
  if (filters.enrollmentStatus) where.enrollmentStatus = filters.enrollmentStatus;
  if (filters.currentClassLevel) where.OR = [ { currentClassLevel: filters.currentClassLevel }, { currentClassLevels: { has: filters.currentClassLevel } } ];

  const page = parseInt(filters.page) || 1;
  const limit = Math.min(parseInt(filters.limit) || 100, 100);
  const skip = (page -1) * limit;

  const total = await prisma.student.count({ where });
  const students = await prisma.student.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } });
  // strip passwords
  students.forEach(s => { if (s.password) delete s.password; });
  return responseStatus(res, 200, 'success', { students, pagination: { total, page, limit, pages: Math.ceil(total/limit) } });
};

exports.getStudentByAdminService = async (studentID, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const student = await prisma.student.findUnique({ where: { id: studentID } });
  if (!student) return responseStatus(res, 402, 'failed', 'Student not found');
  delete student.password;
  return responseStatus(res, 200, 'success', student);
};

exports.studentUpdateProfileService = async (data, userId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const { email, password } = data;
  if (email) {
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing && existing.id !== userId) return responseStatus(res, 402, 'failed', 'This email is taken/exist');
  }
  const updateData = {};
  if (email) updateData.email = email;
  if (password) updateData.password = await hashPassword(password);
  const updated = await prisma.student.update({ where: { id: userId }, data: updateData });
  if (updated.password) delete updated.password;
  return responseStatus(res, 200, 'success', updated);
};

exports.adminUpdateStudentService = async (data, studentId, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const update = {};
  if (data.name) update.name = data.name;
  if (data.email) update.email = data.email;
  if (data.academicYear) update.academicYear = data.academicYear;
  if (data.program) update.program = data.program;
  if (data.prefectName) update.prefectName = data.prefectName;
  if (data.classLevels) update.currentClassLevels = { set: data.classLevels };
  const updated = await prisma.student.update({ where: { id: studentId }, data: update });
  if (updated.password) delete updated.password;
  return responseStatus(res, 200, 'success', updated);
};

exports.studentSelfRegisterService = async (data, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const { name, email, password } = data;
  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) return responseStatus(res, 402, 'failed', 'Email already registered');
  const hashed = await hashPassword(password);
  const defaultSchoolId = process.env.DEFAULT_SCHOOL_ID || 'SCHOOL-IMPORT-1';
  const created = await prisma.student.create({ data: { name, email, password: hashed, role: 'student', schoolId: defaultSchoolId } });
  return responseStatus(res, 201, 'success', { message: 'Registration successful. Please login.', student: { id: created.id, name: created.name, email: created.email, role: created.role } });
};

// export other helpers as needed
