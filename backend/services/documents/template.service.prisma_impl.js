const { getPrisma } = require('../../lib/prismaClient');

exports.listTemplates = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const templates = await prisma.documentTemplate.findMany({ where: { schoolId } });
    return res.status(200).json({ status: 'success', data: templates });
  } catch (err) {
    console.error('[Prisma][DocumentTemplate] list error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const payload = { ...req.body, schoolId };
    const created = await prisma.documentTemplate.create({ data: payload });
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    console.error('[Prisma][DocumentTemplate] create error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const updated = await prisma.documentTemplate.updateMany({ where: { id, schoolId }, data: req.body });
    if (updated.count === 0) return res.status(404).json({ status: 'fail', message: 'Template not found' });
    const t = await prisma.documentTemplate.findUnique({ where: { id } });
    return res.status(200).json({ status: 'success', data: t });
  } catch (err) {
    console.error('[Prisma][DocumentTemplate] update error', err);
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
