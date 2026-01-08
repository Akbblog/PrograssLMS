const { getPrisma } = require('../../lib/prismaClient');
const { hashPassword, isPassMatched } = require('../../handlers/passHash.handler');
const responseStatus = require('../../handlers/responseStatus.handler.js');
const eventBus = require('../../utils/eventBus');
const EVENTS = require('../../utils/events');
const generateToken = require('../../utils/tokenGenerator');

exports.registerAdminService = async (data, res) => {
  const { name, email, password } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  try {
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return responseStatus(res, 401, 'failed', 'Email Already in use');

    const created = await prisma.admin.create({ data: { name, email, password: await hashPassword(password) } });
    eventBus.dispatch(EVENTS.ADMIN.REGISTERED, created);
    return responseStatus(res, 201, 'success', 'Registration Successful!');
  } catch (err) {
    console.error('[Prisma][Admin] register error', err);
    return responseStatus(res, 500, 'failed', 'Registration failed');
  }
};

exports.loginAdminService = async (data, res) => {
  const { email, password } = data;
  console.log('[Admin Login] Attempting login for:', email);
  const prisma = getPrisma();
  if (!prisma) {
    console.error('[Admin Login] Prisma client not available');
    return responseStatus(res, 500, 'failed', 'Database unavailable');
  }
  try {
    console.log('[Admin Login] Searching for admin with email:', email);
    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user) {
      console.log('[Admin Login] Admin not found:', email);
      return responseStatus(res, 401, 'failed', 'Invalid login credentials');
    }

    console.log('[Admin Login] Admin found, verifying password...');
    const isPassValid = await isPassMatched(password, user.password);
    if (!isPassValid) {
      console.log('[Admin Login] Password mismatch for:', email);
      return responseStatus(res, 401, 'failed', 'Invalid login credentials');
    }

    let schoolFeatures = {};
    if (user.schoolId) {
      const school = await prisma.school.findUnique({ where: { id: user.schoolId }, select: { features: true } });
      if (school) schoolFeatures = school.features || {};
    }

    const token = generateToken(user.id, user.role, user.schoolId);
    const result = { user: { id: user.id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId, features: schoolFeatures }, token };
    eventBus.dispatch(EVENTS.ADMIN.LOGIN, user);
    return responseStatus(res, 200, 'success', result);
  } catch (err) {
    console.error('[Prisma][Admin] login error', err);
    return responseStatus(res, 500, 'failed', 'Login failed');
  }
};

exports.getAdminsService = async () => {
  const prisma = getPrisma();
  if (!prisma) return [];
  const users = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return users;
};

exports.getSingleProfileService = async (id, res) => {
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) return responseStatus(res, 201, 'failed', "Admin doesn't exist ");
  return responseStatus(res, 201, 'success', user);
};

exports.updateAdminService = async (id, data, res) => {
  const { email, name, password } = data;
  const prisma = getPrisma();
  if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');
  try {
    const emailTaken = await prisma.admin.findUnique({ where: { email } });
    if (emailTaken && String(emailTaken.id) !== String(id)) return 'Email is already in use';

    if (password) {
      const updated = await prisma.admin.update({ where: { id }, data: { name, email, password: await hashPassword(password) } });
      return responseStatus(res, 201, 'success', updated);
    }

    const updated = await prisma.admin.update({ where: { id }, data: { email, name } });
    return responseStatus(res, 201, 'success', updated);
  } catch (err) {
    console.error('[Prisma][Admin] update error', err);
    return responseStatus(res, 500, 'failed', 'Update failed');
  }
};
