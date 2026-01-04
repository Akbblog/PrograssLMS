const DocumentTemplate = require('../../models/Documents/DocumentTemplate.model');
const generator = require('../../services/documentGenerator');

exports.listTemplates = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const list = await DocumentTemplate.find({ schoolId });
    res.status(200).json({ status: 'success', data: list });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.createTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const t = await DocumentTemplate.create(payload);
    res.status(201).json({ status: 'success', data: t });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const t = await DocumentTemplate.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    res.status(200).json({ status: 'success', data: t });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.generateFeeVoucher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    // load required data (student, fee) - simplified here
    const pdfBuffer = await generator.generateDocument('feeVoucher', { studentId, schoolId });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="fee-voucher-${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.downloadDocument = async (req, res) => {
  // placeholder - would fetch stored document
  res.status(200).json({ status: 'success', data: null });
};