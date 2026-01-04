const StaffProfile = require('../../models/HR/StaffProfile.model');

exports.listStaff = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await StaffProfile.find({ schoolId }).populate('user');
    res.status(200).json({ status: 'success', data: list });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.createStaff = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const staff = await StaffProfile.create(payload);
    res.status(201).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.getStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const staff = await StaffProfile.findOne({ _id: id, schoolId }).populate('user');
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const staff = await StaffProfile.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!staff) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: staff });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};