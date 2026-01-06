const TemplateService = require('../../services/documents/template.service');
const generator = require('../../services/documentGenerator');

exports.listTemplates = TemplateService.listTemplates;
exports.createTemplate = TemplateService.createTemplate;
exports.updateTemplate = TemplateService.updateTemplate;

exports.generateFeeVoucher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const pdfBuffer = await generator.generateDocument('feeVoucher', { studentId, schoolId });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="fee-voucher-${studentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.downloadDocument = async (req, res) => {
  res.status(200).json({ status: 'success', data: null });
};