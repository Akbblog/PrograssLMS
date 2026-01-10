const StaffProfile = require('../../models/HR/StaffProfile.model');

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

exports.listStaff = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    // Fetch existing HR staff profiles
    const staffProfiles = await StaffProfile.find({ schoolId }).populate('user');

    // Also include teachers as staff members so HR view shows teachers by default
    const Teacher = require('../../models/Staff/teachers.model');
    const teachers = await Teacher.find({ schoolId }).lean();

    const mappedTeachers = teachers.map(t => ({
      _id: t._id,
      employeeId: t.teacherId || t._id,
      personalInfo: {
        firstName: t.name ? t.name.split(' ')[0] : '',
        lastName: t.name ? t.name.split(' ').slice(1).join(' ') : '',
        photo: t.avatar || null,
      },
      contactInfo: {
        email: t.email,
        phone: t.phone || '',
      },
      employmentInfo: {
        department: 'teaching',
        designation: t.program || 'Teacher',
      },
      status: t.status || t.isWithdrawn ? 'withdrawn' : (t.isSuspended ? 'suspended' : 'active'),
      // keep original teacher document for reference
      _source: 'teacher',
      raw: t,
    }));

    // Merge staff profiles and mapped teachers, avoiding duplicates (by email or id)
    const combined = [];
    const seen = new Set();

    const pushIfNew = (item) => {
      const key = String(item._id) || item.contactInfo?.email || '';
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    };

    staffProfiles.forEach(sp => pushIfNew(sp));
    mappedTeachers.forEach(mt => pushIfNew(mt));

    res.status(200).json({ status: 'success', data: combined });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.createStaff = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'HR staff is not yet supported in Prisma mode' });
    }
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const staff = await StaffProfile.create(payload);
    res.status(201).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.getStaff = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(404).json({ status: 'fail', message: 'Not found' });
    }
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const staff = await StaffProfile.findOne({ _id: id, schoolId }).populate('user');
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.updateStaff = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'HR staff is not yet supported in Prisma mode' });
    }
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const staff = await StaffProfile.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};