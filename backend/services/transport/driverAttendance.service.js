// Driver attendance service with Prisma delegation
if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
  module.exports = require('./driverAttendance.service.prisma_impl');
  return;
}

const DriverAttendance = require('../../models/Transport/DriverAttendance.model');

exports.markAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const attendance = await DriverAttendance.create(payload);
    return res.status(201).json({ status: 'success', data: attendance });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const records = await DriverAttendance.find({ schoolId }).populate('driver vehicle route');
    return res.status(200).json({ status: 'success', data: records });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const activeVehicles = await DriverAttendance.distinct('vehicle', { schoolId });
    const activeRoutes = await DriverAttendance.distinct('route', { schoolId });
    const studentsUsing = await DriverAttendance.countDocuments({ schoolId });

    return res.status(200).json({ status: 'success', data: { activeVehicles: activeVehicles.length, activeRoutes: activeRoutes.length, studentsUsing } });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
