const { getPrisma } = require('../../lib/prismaClient');

exports.createAllocation = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const allocation = await prisma.transportAllocation.create({ data: { studentId: payload.student, routeId: payload.route, vehicleAssignedId: payload.vehicleAssigned, schoolId: payload.schoolId } });
    return res.status(201).json({ status: 'success', data: allocation });
  } catch (err) {
    console.error('[Prisma][Allocation] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAllocations = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocations = await prisma.transportAllocation.findMany({ where: { schoolId }, include: { student: true, route: true, vehicleAssigned: true } });
    return res.status(200).json({ status: 'success', data: allocations });
  } catch (err) {
    console.error('[Prisma][Allocation] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const updated = await prisma.transportAllocation.updateMany({ where: { id, schoolId }, data: req.body });
    if (updated.count === 0) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    const allocation = await prisma.transportAllocation.findUnique({ where: { id } });
    return res.status(200).json({ status: 'success', data: allocation });
  } catch (err) {
    console.error('[Prisma][Allocation] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const deleted = await prisma.transportAllocation.deleteMany({ where: { id, schoolId } });
    if (deleted.count === 0) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    return res.status(200).json({ status: 'success', data: { id } });
  } catch (err) {
    console.error('[Prisma][Allocation] delete error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getStudentAllocation = async (req, res) => {
  try {
    const { id } = req.params; // student id
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocation = await prisma.transportAllocation.findFirst({ where: { studentId: id, schoolId }, include: { route: true, vehicleAssigned: true } });
    if (!allocation) return res.status(404).json({ status: 'fail', message: 'Allocation not found' });
    return res.status(200).json({ status: 'success', data: allocation });
  } catch (err) {
    console.error('[Prisma][Allocation] student allocation error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getRouteAllocations = async (req, res) => {
  try {
    const { id } = req.params; // route id
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const allocations = await prisma.transportAllocation.findMany({ where: { routeId: id, schoolId }, include: { student: true, vehicleAssigned: true } });
    return res.status(200).json({ status: 'success', data: allocations });
  } catch (err) {
    console.error('[Prisma][Allocation] route allocations error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
