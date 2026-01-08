const Appraisal = require('../../models/HR/Appraisal.model');

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

exports.listAppraisals = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await Appraisal.find({ schoolId }).populate('staff reviewer');
    res.status(200).json({ status: 'success', data: list });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.createAppraisal = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'Appraisals are not yet supported in Prisma mode' });
    }
    const payload = { ...req.body, schoolId: req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null };
    const rec = await Appraisal.create(payload);
    res.status(201).json({ status: 'success', data: rec });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.updateAppraisal = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'Appraisals are not yet supported in Prisma mode' });
    }
    const { id } = req.params;
    const rec = await Appraisal.findByIdAndUpdate(id, req.body, { new: true });
    if (!rec) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: rec });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};