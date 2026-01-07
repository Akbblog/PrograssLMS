const { getPrisma } = require('../../lib/prismaClient');
const { hashPassword, isPassMatched } = require('../../handlers/passHash.handler');
const responseStatus = require('../../handlers/responseStatus.handler');
const generateToken = require('../../utils/tokenGenerator');
const Admin = require('../../models/Staff/admin.model');

exports.createTeacherService = async (data, adminId, res) => {
  const { name, email, password, phone, dateOfBirth, gender, employeeId, department, qualifications, specialization, experience, dateOfJoining, subject, classLevels, academicYear, address, nationality, employmentType, salary } = data;

  // Check if teacher exists
  const existing = await prisma.teacher.findUnique({ where: { email } });
  if (existing) return responseStatus(res, 400, 'failed', 'Teacher with this email already exists');

  // Get admin to find schoolId
  const admin = await Admin.findById(adminId);
  if (!admin) return responseStatus(res, 401, 'fail', 'Unauthorized access');
  const schoolId = admin.schoolId || 'SCHOOL-IMPORT-1';

  const hashed = await hashPassword(password);
  const created = await prisma.teacher.create({ data: {
    name, email, password: hashed, phone, dateOfBirth, gender, employeeId, department,
    qualifications, specialization, experience, dateEmployed: dateOfJoining || dateOfJoining,
    subject: subject || null, classLevels: classLevels || [], academicYear: academicYear || null,
    address: address || null, nationality, employmentType, salary, createdBy: adminId, schoolId: String(schoolId)
  }});

  // push to admin (mongoose)
  admin.teachers.push(created.id);
  await admin.save();

  return responseStatus(res, 201, 'success', created);
};

exports.teacherLoginService = async (data, res) => {
  const { email, password } = data;
  const teacher = await prisma.teacher.findUnique({ where: { email } });
  if (!teacher) return responseStatus(res, 401, 'failed', 'Invalid login credentials');
  const matched = await isPassMatched(password, teacher.password);
  if (!matched) return responseStatus(res, 401, 'failed', 'Invalid login credentials');
  const { password: pw, ...t } = teacher;
  const token = generateToken(teacher.id, teacher.role || 'teacher', teacher.schoolId);
  return responseStatus(res, 200, 'success', { teacher: t, token });
};

exports.getAllTeachersService = async (schoolId, options = {}) => {
  const where = {};
  if (schoolId) where.schoolId = String(schoolId);
  const page = parseInt(options.page) || 1;
  const limit = Math.min(parseInt(options.limit) || 25, 100);
  const skip = (page -1) * limit;
  const total = await prisma.teacher.count({ where });
  const teachers = await prisma.teacher.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { password: false } });
  return { teachers, pagination: { total, page, limit, pages: Math.ceil(total/limit) } };
};

exports.getTeacherProfileService = async (teacherId) => {
  const t = await prisma.teacher.findUnique({ where: { id: teacherId }, select: { password: false } });
  return t;
};

exports.updateTeacherProfileService = async (data, teacherId, res) => {
  const { name, email, password } = data;
  if (email) {
    const exist = await prisma.teacher.findUnique({ where: { email } });
    if (exist && exist.id !== teacherId) return responseStatus(res, 402, 'failed', 'Email already in use');
  }
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (password) update.password = await hashPassword(password);
  const updated = await prisma.teacher.update({ where: { id: teacherId }, data: update });
  if (updated.password) delete updated.password;
  return { teacher: updated, token: generateToken(updated.id) };
};

exports.adminUpdateTeacherProfileService = async (data, teacherId) => {
  const update = {};
  if (data.program) update.program = data.program;
  if (data.classLevel) update.classLevel = data.classLevel;
  if (data.academicYear) update.academicYear = data.academicYear;
  if (data.subject) update.subject = data.subject;
  const updated = await prisma.teacher.update({ where: { id: teacherId }, data: update });
  return updated;
};

exports.getTeacherDashboardService = async (teacherId, schoolId) => {
  // Minimal implementation using Prisma for assignments/enrollments not yet in schema
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) return { error: 'Teacher not found' };
  return { success: true, data: { classes: [], upcomingAssignments: [], todaysAssignments: [], counts: {} } };
};
