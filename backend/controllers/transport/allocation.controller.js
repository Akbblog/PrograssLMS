const TransportAllocation = require('../../models/Transport/TransportAllocation.model');
const Student = require('../../models/Students/students.model');

exports.createAllocation = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const allocation = await TransportAllocation.create(payload);
    res.status(201).json({ status: 'success', data: allocation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAllocations = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocations = await TransportAllocation.find({ schoolId }).populate('student route vehicleAssigned');
    res.status(200).json({ status: 'success', data: allocations });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocation = await TransportAllocation.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!allocation) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    res.status(200).json({ status: 'success', data: allocation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocation = await TransportAllocation.findOneAndDelete({ _id: id, schoolId });
    if (!allocation) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    res.status(200).json({ status: 'success', data: allocation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStudentAllocation = async (req, res) => {
  try {
    const { id } = req.params; // student id
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocation = await TransportAllocation.findOne({ student: id, schoolId }).populate('route vehicleAssigned');
    if (!allocation) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    res.status(200).json({ status: 'success', data: allocation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getRouteAllocations = async (req, res) => {
  try {
    const { id } = req.params; // route id
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocations = await TransportAllocation.find({ route: id, schoolId }).populate('student vehicleAssigned');
    res.status(200).json({ status: 'success', data: allocations });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};