const DriverAttendance = require('../../models/Transport/DriverAttendance.model');

exports.markAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const attendance = await DriverAttendance.create(payload);
    res.status(201).json({ status: 'success', data: attendance });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const records = await DriverAttendance.find({ schoolId }).populate('driver vehicle route');
    res.status(200).json({ status: 'success', data: records });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const activeVehicles = await DriverAttendance.distinct('vehicle', { schoolId });
    const activeRoutes = await DriverAttendance.distinct('route', { schoolId });
    const studentsUsing = await DriverAttendance.countDocuments({ schoolId }); // placeholder

    res.status(200).json({ status: 'success', data: { activeVehicles: activeVehicles.length, activeRoutes: activeRoutes.length, studentsUsing } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};