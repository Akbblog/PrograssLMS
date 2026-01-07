const { getPrisma } = require('../../lib/prismaClient');

exports.createVehicle = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const data = { ...req.body, schoolId };
    const vehicle = await prisma.vehicle.create({ data });
    return res.status(201).json({ status: 'success', data: vehicle });
  } catch (err) {
    console.error('[Prisma][Vehicle] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicles = await prisma.vehicle.findMany({ where: { schoolId } });
    return res.status(200).json({ status: 'success', data: vehicles });
  } catch (err) {
    console.error('[Prisma][Vehicle] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const vehicle = await prisma.vehicle.updateMany({ where: { id, schoolId }, data: req.body });
    if (vehicle.count === 0) return res.status(404).json({ status: 'fail', message: 'Vehicle not found' });
    const updated = await prisma.vehicle.findUnique({ where: { id } });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    console.error('[Prisma][Vehicle] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(500).json({ status: 'fail', message: 'Database unavailable' });
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const deleted = await prisma.vehicle.deleteMany({ where: { id, schoolId } });
    if (deleted.count === 0) return res.status(404).json({ status: 'fail', message: 'Vehicle not found' });
    return res.status(200).json({ status: 'success', data: { id } });
  } catch (err) {
    console.error('[Prisma][Vehicle] delete error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
