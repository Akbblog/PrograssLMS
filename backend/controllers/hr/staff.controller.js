const StaffProfile = require('../../models/HR/StaffProfile.model');

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

exports.listStaff = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await StaffProfile.find({ schoolId }).populate('user');
    res.status(200).json({ status: 'success', data: list });
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