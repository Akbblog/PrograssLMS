const Route = require('../../models/Transport/Route.model');

exports.createRoute = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const route = await Route.create({ ...req.body, schoolId });
    res.status(201).json({ status: 'success', data: route });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const routes = await Route.find({ schoolId }).populate('vehicle');
    res.status(200).json({ status: 'success', data: routes });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const route = await Route.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!route) return res.status(404).json({ status: 'fail', message: 'Route not found' });
    res.status(200).json({ status: 'success', data: route });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const route = await Route.findOneAndDelete({ _id: id, schoolId });
    if (!route) return res.status(404).json({ status: 'fail', message: 'Route not found' });
    res.status(200).json({ status: 'success', data: route });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};