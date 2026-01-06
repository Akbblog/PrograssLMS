const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRoute = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const data = { ...req.body, schoolId };
    const route = await prisma.route.create({ data });
    return res.status(201).json({ status: 'success', data: route });
  } catch (err) {
    console.error('[Prisma][Route] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const routes = await prisma.route.findMany({ where: { schoolId }, include: { vehicle: true } });
    return res.status(200).json({ status: 'success', data: routes });
  } catch (err) {
    console.error('[Prisma][Route] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const updated = await prisma.route.updateMany({ where: { id, schoolId }, data: req.body });
    if (updated.count === 0) return res.status(404).json({ status: 'fail', message: 'Route not found' });
    const route = await prisma.route.findUnique({ where: { id } });
    return res.status(200).json({ status: 'success', data: route });
  } catch (err) {
    console.error('[Prisma][Route] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const deleted = await prisma.route.deleteMany({ where: { id, schoolId } });
    if (deleted.count === 0) return res.status(404).json({ status: 'fail', message: 'Route not found' });
    return res.status(200).json({ status: 'success', data: { id } });
  } catch (err) {
    console.error('[Prisma][Route] delete error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
