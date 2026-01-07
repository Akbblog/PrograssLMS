const { getPrisma } = require('../../lib/prismaClient');

exports.markAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const attendance = await prisma.driverAttendance.create({ data: { driverId: payload.driver, vehicleId: payload.vehicle, routeId: payload.route, date: payload.date ? new Date(payload.date) : new Date(), schoolId } });
    return res.status(201).json({ status: 'success', data: attendance });
  } catch (err) {
    console.error('[Prisma][DriverAttendance] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const records = await prisma.driverAttendance.findMany({ where: { schoolId }, include: { driver: true, vehicle: true, route: true } });
    return res.status(200).json({ status: 'success', data: records });
  } catch (err) {
    console.error('[Prisma][DriverAttendance] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const activeVehicles = await prisma.driverAttendance.findMany({ where: { schoolId }, select: { vehicleId: true } });
    const activeRoutes = await prisma.driverAttendance.findMany({ where: { schoolId }, select: { routeId: true } });
    const uniqueVehicles = new Set(activeVehicles.map(v => v.vehicleId));
    const uniqueRoutes = new Set(activeRoutes.map(r => r.routeId));
    const studentsUsing = await prisma.driverAttendance.count({ where: { schoolId } });

    return res.status(200).json({ status: 'success', data: { activeVehicles: uniqueVehicles.size, activeRoutes: uniqueRoutes.size, studentsUsing } });
  } catch (err) {
    console.error('[Prisma][DriverAttendance] stats error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
