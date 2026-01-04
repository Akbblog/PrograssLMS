const Vehicle = require('../../models/Transport/Vehicle.model');

exports.createVehicle = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicle = await Vehicle.create({ ...req.body, schoolId });
    res.status(201).json({ status: 'success', data: vehicle });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicles = await Vehicle.find({ schoolId });
    res.status(200).json({ status: 'success', data: vehicles });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicle = await Vehicle.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ status: 'fail', message: 'Vehicle not found' });
    res.status(200).json({ status: 'success', data: vehicle });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicle = await Vehicle.findOneAndDelete({ _id: id, schoolId });
    if (!vehicle) return res.status(404).json({ status: 'fail', message: 'Vehicle not found' });
    res.status(200).json({ status: 'success', data: vehicle });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};