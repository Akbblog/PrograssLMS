const LeaveApplication = require('../../models/HR/LeaveApplication.model');
const LeaveBalance = require('../../models/HR/LeaveBalance.model');

exports.listLeaves = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const leaves = await LeaveApplication.find({ schoolId }).populate('staff leaveType');
    res.status(200).json({ status: 'success', data: leaves });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.applyLeave = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const app = await LeaveApplication.create(payload);
    res.status(201).json({ status: 'success', data: app });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const approver = req.user?._id || req.userId || req.userAuth?.id;
    const leave = await LeaveApplication.findById(id);
    if (!leave) return res.status(404).json({ status: 'fail', message: 'Not found' });
    leave.status = 'approved';
    leave.approvedBy = approver;
    await leave.save();
    res.status(200).json({ status: 'success', data: leave });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const leave = await LeaveApplication.findById(id);
    if (!leave) return res.status(404).json({ status: 'fail', message: 'Not found' });
    leave.status = 'rejected';
    leave.remarks = remarks;
    await leave.save();
    res.status(200).json({ status: 'success', data: leave });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.getBalance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const bal = await LeaveBalance.findOne({ staff: staffId });
    res.status(200).json({ status: 'success', data: bal });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};