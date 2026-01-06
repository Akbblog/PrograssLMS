// Document template service: delegates to Prisma impl when enabled
if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
  module.exports = require('./template.service.prisma_impl');
  return;
}

const DocumentTemplate = require('../../models/Documents/DocumentTemplate.model');

exports.listTemplates = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await DocumentTemplate.find({ schoolId });
    return res.status(200).json({ status: 'success', data: list });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const t = await DocumentTemplate.create(payload);
    return res.status(201).json({ status: 'success', data: t });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const t = await DocumentTemplate.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    return res.status(200).json({ status: 'success', data: t });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
