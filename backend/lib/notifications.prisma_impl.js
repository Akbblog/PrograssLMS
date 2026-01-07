const { getPrisma } = require('./prismaClient');
const eventBus = require('../utils/eventBus');

async function _getUsersForRole(role, schoolId) {
  // Attempt to query based on role; fallback to empty
  try {
    const prisma = getPrisma();
    if (!prisma) {
      console.warn('[Prisma][Notifications] client not available in _getUsersForRole');
      return [];
    }
    if (role === 'admin') return await prisma.admin.findMany({ where: schoolId ? { schoolId } : {} });
    if (role === 'teacher') return await prisma.teacher.findMany({ where: schoolId ? { schoolId } : {} });
    if (role === 'student') return await prisma.student.findMany({ where: schoolId ? { schoolId } : {} });
  } catch (err) {
    console.warn('[Prisma][Notifications] _getUsersForRole fallback', err && err.message ? err.message : err);
  }
  return [];
}

async function createNotification({ title, message, type = 'info', targetRoles = [], userId = null, userModel = 'System', actionUrl = '', meta = {}, schoolId = null }) {
  const prisma = getPrisma();
  if (!prisma) {
    console.warn('[Prisma][Notifications] createNotification skipped - prisma client unavailable');
    return { notification: null, recipientsCount: 0 };
  }

  const notification = await prisma.notification.create({ data: { title, message, type, targetRoles: JSON.stringify(targetRoles), userId, userModel, actionUrl, meta: JSON.stringify(meta), schoolId } });

  const recipients = [];
  if (userId) recipients.push({ notificationId: notification.id, userId, userModel, schoolId });

  for (const role of targetRoles) {
    const users = await _getUsersForRole(role, schoolId);
    users.forEach(u => recipients.push({ notificationId: notification.id, userId: u.id, userModel: role === 'admin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1), schoolId: u.schoolId || schoolId }));
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  for (const r of recipients) {
    const key = String(r.userId);
    if (!seen.has(key)) { seen.add(key); unique.push(r); }
  }

  if (unique.length) {
    const createMany = unique.map(u => ({ notificationId: u.notificationId, userId: u.userId, userModel: u.userModel, schoolId: u.schoolId }));
    await prisma.notificationRecipient.createMany({ data: createMany });
  }

  const dbRecipients = await prisma.notificationRecipient.findMany({ where: { notificationId: notification.id } });
  eventBus.dispatch('notification.created', { notification, recipients: dbRecipients });
  return { notification, recipientsCount: unique.length };
}

async function getNotificationsForUser(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const prisma = getPrisma();
  if (!prisma) {
    console.warn('[Prisma][Notifications] getNotificationsForUser - prisma unavailable');
    return [];
  }
  const recipients = await prisma.notificationRecipient.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit });
  const notificationIds = recipients.map(r => r.notificationId);
  const notifications = await prisma.notification.findMany({ where: { id: { in: notificationIds } } });
  const mapById = notifications.reduce((acc, n) => ((acc[String(n.id)] = n), acc), {});
  return recipients.map(r => ({ recipient: r, notification: mapById[String(r.notificationId)] }));
}

async function markRead(userId, notificationId) {
  const prisma = getPrisma();
  if (!prisma) {
    console.warn('[Prisma][Notifications] markRead - prisma unavailable');
    throw new Error('Database unavailable');
  }
  const recipient = await prisma.notificationRecipient.updateMany({ where: { userId, notificationId }, data: { readAt: new Date() } });
  if (recipient.count === 0) throw new Error('Notification recipient not found');
  return recipient;
}

async function markAllRead(userId) {
  const prisma = getPrisma();
  if (!prisma) {
    console.warn('[Prisma][Notifications] markAllRead - prisma unavailable');
    throw new Error('Database unavailable');
  }
  const res = await prisma.notificationRecipient.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
  return res;
}

async function getUnreadCount(userId) {
  const prisma = getPrisma();
  if (!prisma) {
    console.warn('[Prisma][Notifications] getUnreadCount - prisma unavailable');
    return 0;
  }
  const count = await prisma.notificationRecipient.count({ where: { userId, readAt: null } });
  return count;
}

module.exports = { createNotification, getNotificationsForUser, markRead, markAllRead, getUnreadCount };
