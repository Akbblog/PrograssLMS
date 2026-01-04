const DataImporter = require('../../services/dataMigration/DataImporter.service');
const MigrationTemplate = require('../../models/Migration/MigrationTemplate.model');
const MigrationLog = require('../../models/Migration/MigrationLog.model');

exports.upload = async (req, res) => {
  try {
    const file = req.file; // assume multer
    const rows = await DataImporter.parseFile(file.buffer);
    res.status(200).json({ status: 'success', data: { sample: rows.slice(0, 10) } });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.validate = async (req, res) => {
  try {
    const { rows, templateId } = req.body;
    const template = await MigrationTemplate.findById(templateId);
    const result = await DataImporter.validateData(rows, template);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.execute = async (req, res) => {
  try {
    const { rows, templateId } = req.body;
    const template = await MigrationTemplate.findById(templateId);
    const log = await DataImporter.executeMigration(rows, template, req.user?._id || req.userId);
    res.status(200).json({ status: 'success', data: log });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.status = async (req, res) => {
  try {
    const { migrationId } = req.params;
    const log = await MigrationLog.findOne({ migrationId });
    res.status(200).json({ status: 'success', data: log });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.logs = async (req, res) => {
  try {
    const logs = await MigrationLog.find({ schoolId: req.user?.schoolId || req.schoolId });
    res.status(200).json({ status: 'success', data: logs });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.rollback = async (req, res) => {
  try {
    const { id } = req.params;
    // Placeholder: real rollback would revert created records
    const log = await MigrationLog.findByIdAndUpdate(id, { status: 'failed' }, { new: true });
    res.status(200).json({ status: 'success', data: log });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};