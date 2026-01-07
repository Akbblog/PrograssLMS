const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Prisma-backed attendance service implementation.
 * Note: Prisma schema must include an `Attendance` model with fields used below.
 */
exports.markAttendanceService = async (data, userId, userRole, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const { classLevel, date, records, academicYear, academicTerm } = data;

  // resolve schoolId from admin or teacher
  let schoolId = null;
  try {
    if (userRole === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: userId } });
      if (!admin) return responseStatus(res, 401, 'failed', 'User not found');
      schoolId = admin.schoolId;
    } else {
      const teacher = await prisma.teacher.findUnique({ where: { id: userId } });
      if (!teacher) return responseStatus(res, 401, 'failed', 'User not found');
      schoolId = teacher.schoolId;
    }

    if (!schoolId) return responseStatus(res, 400, 'failed', 'No school associated with this user');

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // attempt to find existing record
    const existing = await prisma.attendance.findFirst({
      where: {
        schoolId,
        classLevel: classLevel,
        date: attendanceDate,
      }
    });

    if (existing) {
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: { records: JSON.stringify(records), takenBy: userId }
      });
      return responseStatus(res, 200, 'success', { message: 'Attendance updated successfully', data: updated });
    }

    const created = await prisma.attendance.create({
      data: {
        schoolId,
        classLevel,
        date: attendanceDate,
        records: JSON.stringify(records),
        academicYear,
        academicTerm,
        takenBy: userId,
      }
    });

    return responseStatus(res, 201, 'success', { message: 'Attendance marked successfully', data: created });
  } catch (err) {
    console.error('[Prisma][Attendance] error', err);
    return responseStatus(res, 500, 'failed', 'Attendance operation failed');
  }
};

exports.getAttendanceService = async (classLevel, date, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return null;
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: { schoolId, classLevel, date: attendanceDate }
  });

  // parse records if stored as JSON
  if (attendance && typeof attendance.records === 'string') {
    try { attendance.records = JSON.parse(attendance.records); } catch (e) {}
  }

  return attendance;
};

exports.getAttendanceHistoryService = async (classLevel, startDate, endDate, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const where = { schoolId, classLevel };
  if (startDate && endDate) where.date = { gte: new Date(startDate), lte: new Date(endDate) };

  const records = await prisma.attendance.findMany({ where, orderBy: { date: 'desc' } });
  return records.map(r => ({ ...r, records: typeof r.records === 'string' ? JSON.parse(r.records || '[]') : r.records }));
};

exports.getStudentAttendanceService = async (studentId, startDate, endDate, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const where = { schoolId };
  if (startDate && endDate) where.date = { gte: new Date(startDate), lte: new Date(endDate) };

  // crude filter: load records and filter client-side by studentId in records array
  const attendance = await prisma.attendance.findMany({ where, orderBy: { date: 'desc' } });
  const results = [];
  for (const a of attendance) {
    const recs = typeof a.records === 'string' ? JSON.parse(a.records || '[]') : a.records || [];
    const match = recs.find(r => String(r.student) === String(studentId));
    if (match) {
      results.push({ date: a.date, classLevel: a.classLevel, status: match.status, remarks: match.remarks });
    }
  }
  return results;
};

exports.getAttendanceSummaryService = async (classLevel, startDate, endDate, schoolId) => {
  const prisma = getPrisma();
  if (!prisma) return { totalDays: 0, totalPresent: 0, totalAbsent: 0, totalLate: 0, attendanceRate: 0 };
  const where = { schoolId, classLevel };
  if (startDate && endDate) where.date = { gte: new Date(startDate), lte: new Date(endDate) };

  const attendanceRecords = await prisma.attendance.findMany({ where });

  let totalDays = attendanceRecords.length;
  let totalPresent = 0, totalAbsent = 0, totalLate = 0;

  for (const rec of attendanceRecords) {
    const recs = typeof rec.records === 'string' ? JSON.parse(rec.records || '[]') : rec.records || [];
    for (const r of recs) {
      if (r.status === 'present') totalPresent++;
      else if (r.status === 'absent') totalAbsent++;
      else if (r.status === 'late') totalLate++;
    }
  }

  const totalRecords = totalPresent + totalAbsent + totalLate;
  const attendanceRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  return { totalDays, totalPresent, totalAbsent, totalLate, attendanceRate };
};

exports.deleteAttendanceService = async (attendanceId, schoolId, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
    const deleted = await prisma.attendance.deleteMany({ where: { id: attendanceId, schoolId } });
    if (deleted.count === 0) return responseStatus(res, 404, 'failed', 'Attendance record not found');
    return responseStatus(res, 200, 'success', { message: 'Attendance deleted successfully' });
  } catch (err) {
    console.error('[Prisma][Attendance] delete error', err);
    return responseStatus(res, 500, 'failed', 'Attendance delete failed');
  }
};

exports.getStudentsForAttendanceService = async (classLevel, schoolId) => {
  // Depends on `Student` model in Prisma; fallback to empty array if not present
  try {
    const prisma = getPrisma();
    if (!prisma) return [];
    const students = await prisma.student.findMany({
      where: {
        schoolId,
        enrollmentStatus: 'active',
        isWithdrawn: false,
      },
      select: { id: true, name: true, studentId: true, rollNumber: true, section: true, avatar: true },
      orderBy: [{ rollNumber: 'asc' }, { name: 'asc' }]
    });
    return students;
  } catch (err) {
    console.warn('[Prisma][Attendance] getStudentsForAttendance fallback', err.message);
    return [];
  }
};
