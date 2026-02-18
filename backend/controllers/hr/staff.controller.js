const StaffProfile = require('../../models/HR/StaffProfile.model');
const { getPrisma } = require('../../lib/prismaClient');

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

const getSchoolId = (req) => {
  const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
  return schoolId ? String(schoolId) : null;
};

const parseMaybeJsonObject = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : fallback;
    } catch (err) {
      return fallback;
    }
  }
  return fallback;
};

const parseMaybeJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }
  return [];
};

const splitName = (fullName = '') => {
  const trimmed = String(fullName || '').trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
};

const normalizeTeacherStatus = (teacher) => {
  if (teacher?.status) return teacher.status;
  if (teacher?.isWithdrawn) return 'withdrawn';
  if (teacher?.isSuspended) return 'suspended';
  return 'active';
};

const mapTeacherToHrShape = (teacher) => {
  const { firstName, lastName } = splitName(teacher.name);
  return {
    _id: String(teacher.id || teacher._id),
    employeeId: teacher.teacherId || teacher.employeeId || teacher.id || teacher._id,
    personalInfo: {
      firstName: teacher.firstName || firstName,
      lastName: teacher.lastName || lastName,
      photo: teacher.personalInfoPhoto || teacher.personalInfo?.photo || teacher.avatar || null,
    },
    contactInfo: {
      email: teacher.email || '',
      phone: teacher.phone || '',
    },
    employmentInfo: {
      department: teacher.department || 'teaching',
      designation: teacher.program || teacher.designation || 'Teacher',
    },
    documents: parseMaybeJsonArray(teacher.documents),
    status: normalizeTeacherStatus(teacher),
    _source: 'teacher',
    raw: teacher,
  };
};

const mapPrismaStaffProfile = (staff) => {
  const personalInfo = parseMaybeJsonObject(staff.personalInfo);
  const contactInfo = parseMaybeJsonObject(staff.contactInfo);
  const employmentInfo = parseMaybeJsonObject(staff.employmentInfo);

  return {
    _id: String(staff.id),
    employeeId: staff.employeeId,
    personalInfo: {
      ...personalInfo,
      photo: personalInfo.photo || staff.personalInfoPhoto || null,
    },
    contactInfo,
    employmentInfo,
    qualifications: parseMaybeJsonArray(staff.qualifications),
    documents: parseMaybeJsonArray(staff.documents),
    bankDetails: parseMaybeJsonObject(staff.bankDetails),
    salary: parseMaybeJsonObject(staff.salary),
    status: staff.status || 'active',
    user: staff.userId || null,
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  };
};

const mergeWithoutDuplicates = (staffProfiles, teachers) => {
  const merged = [];
  const seen = new Set();

  const pushIfNew = (item) => {
    const idKey = item?._id ? `id:${String(item._id)}` : null;
    const email = item?.contactInfo?.email ? String(item.contactInfo.email).trim().toLowerCase() : '';
    const emailKey = email ? `email:${email}` : null;

    if (idKey && seen.has(idKey)) return;
    if (emailKey && seen.has(emailKey)) return;

    if (idKey) seen.add(idKey);
    if (emailKey) seen.add(emailKey);
    merged.push(item);
  };

  staffProfiles.forEach(pushIfNew);
  teachers.forEach(pushIfNew);

  return merged;
};

exports.listStaff = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: 'fail', message: 'School context is required' });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) {
        return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
      }

      const [staffProfiles, teachers] = await Promise.all([
        prisma.staffProfile.findMany({
          where: { schoolId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.teacher.findMany({
          where: { schoolId },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const mappedProfiles = staffProfiles.map(mapPrismaStaffProfile);
      const mappedTeachers = teachers.map(mapTeacherToHrShape);
      const combined = mergeWithoutDuplicates(mappedProfiles, mappedTeachers);

      return res.status(200).json({ status: 'success', data: combined });
    }

    const staffProfiles = await StaffProfile.find({ schoolId }).populate('user');
    const Teacher = require('../../models/Staff/teachers.model');
    const teachers = await Teacher.find({ schoolId }).lean();
    const mappedTeachers = teachers.map(mapTeacherToHrShape);
    const combined = mergeWithoutDuplicates(staffProfiles, mappedTeachers);

    return res.status(200).json({ status: 'success', data: combined });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: 'fail', message: 'School context is required' });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) {
        return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
      }

      const payload = req.body || {};
      if (!payload.employeeId) {
        return res.status(400).json({ status: 'fail', message: 'employeeId is required' });
      }

      const created = await prisma.staffProfile.create({
        data: {
          schoolId,
          userId: payload.user || payload.userId || null,
          employeeId: String(payload.employeeId),
          personalInfo: payload.personalInfo || {},
          personalInfoPhoto: payload.personalInfo?.photo || null,
          contactInfo: payload.contactInfo || {},
          employmentInfo: payload.employmentInfo || {},
          qualifications: Array.isArray(payload.qualifications) ? payload.qualifications : [],
          documents: Array.isArray(payload.documents) ? payload.documents : [],
          bankDetails: payload.bankDetails || {},
          salary: payload.salary || {},
          status: payload.status || 'active',
        },
      });

      return res.status(201).json({ status: 'success', data: mapPrismaStaffProfile(created) });
    }

    const payload = { ...req.body, schoolId };
    const staff = await StaffProfile.create(payload);
    return res.status(201).json({ status: 'success', data: staff });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: 'fail', message: 'School context is required' });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) {
        return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
      }

      const staff = await prisma.staffProfile.findFirst({
        where: { id, schoolId },
      });
      if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
      return res.status(200).json({ status: 'success', data: mapPrismaStaffProfile(staff) });
    }

    const staff = await StaffProfile.findOne({ _id: id, schoolId }).populate('user');
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    return res.status(200).json({ status: 'success', data: staff });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: 'fail', message: 'School context is required' });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) {
        return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
      }

      const existing = await prisma.staffProfile.findFirst({ where: { id, schoolId } });
      if (!existing) return res.status(404).json({ status: 'fail', message: 'Not found' });

      const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
      const body = req.body || {};
      const updateData = {};

      if (has(body, 'user') || has(body, 'userId')) updateData.userId = body.user || body.userId || null;
      if (has(body, 'employeeId')) updateData.employeeId = String(body.employeeId);
      if (has(body, 'personalInfo')) updateData.personalInfo = body.personalInfo || {};
      if (has(body, 'contactInfo')) updateData.contactInfo = body.contactInfo || {};
      if (has(body, 'employmentInfo')) updateData.employmentInfo = body.employmentInfo || {};
      if (has(body, 'qualifications')) updateData.qualifications = Array.isArray(body.qualifications) ? body.qualifications : [];
      if (has(body, 'documents')) updateData.documents = Array.isArray(body.documents) ? body.documents : [];
      if (has(body, 'bankDetails')) updateData.bankDetails = body.bankDetails || {};
      if (has(body, 'salary')) updateData.salary = body.salary || {};
      if (has(body, 'status')) updateData.status = body.status || 'active';
      if (body.personalInfo && has(body.personalInfo, 'photo')) {
        updateData.personalInfoPhoto = body.personalInfo.photo || null;
      }

      const updated = await prisma.staffProfile.update({
        where: { id: existing.id },
        data: updateData,
      });

      return res.status(200).json({ status: 'success', data: mapPrismaStaffProfile(updated) });
    }

    const staff = await StaffProfile.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    return res.status(200).json({ status: 'success', data: staff });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
