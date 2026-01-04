const { Notification, NotificationRecipient } = require('../models/notification.model');
const Admin = require('../models/Staff/admin.model');
const Teacher = require('../models/Staff/teachers.model');
const Student = require('../models/Students/students.model');
const eventBus = require('../utils/eventBus');

/**
 * Map role -> Model
 */
const ROLE_MODEL_MAP = {
  admin: Admin,
  teacher: Teacher,
  student: Student,
  // parent may not exist in some deployments; we'll check at runtime
  parent: null,
};

async function _getUsersForRole(role, schoolId) {
  const model = ROLE_MODEL_MAP[role];
  if (!model) {
    // Try dynamic require if parent model exists
    try {
      if (role === 'parent') {
        const Parent = require('../models/Parents/parents.model');
        ROLE_MODEL_MAP.parent = Parent;
        return Parent.find(schoolId ? { schoolId } : {}).exec();
      }
    } catch (err) {
      console.warn('[Notifications] No model for role', role);
      return [];
    }
  }

  return model.find(schoolId ? { schoolId } : {}).exec();
}

/**
 * Create a notification and recipients from targetRoles or a single userId
 */
async function createNotification({ title, message, type = 'info', targetRoles = [], userId = null, userModel = 'System', actionUrl = '', meta = {}, schoolId = null }) {
  const notification = await Notification.create({ title, message, type, targetRoles, userId, userModel, actionUrl, meta, schoolId });

  // Determine recipients
  const recipients = [];

  if (userId) {
    // Single recipient
    recipients.push({ notificationId: notification._id, userId, userModel, schoolId });
  }

  // Roles-based recipients
  for (const role of targetRoles) {
    const users = await _getUsersForRole(role, schoolId);
    users.forEach(u => {
      // Some models store _id directly
      recipients.push({ notificationId: notification._id, userId: u._id, userModel: (role === 'admin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1)), schoolId: u.schoolId || schoolId });
    });
  }

  // Deduplicate recipients by userId
  const uniqueRecipients = [];
  const seen = new Set();
  for (const r of recipients) {
    const key = String(r.userId);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRecipients.push(r);
    }
  }

  // Bulk insert recipients
  if (uniqueRecipients.length) {
    await NotificationRecipient.insertMany(uniqueRecipients.map(r => ({ ...r })));
  }

  // Fetch recipients (with _id) to include in the event
  const dbRecipients = await NotificationRecipient.find({ notificationId: notification._id }).lean().exec();

  // Emit event for real-time delivery
  eventBus.dispatch('notification.created', { notification: notification.toObject(), recipients: dbRecipients });

  return { notification, recipientsCount: uniqueRecipients.length };
}

async function getNotificationsForUser(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const recipients = await NotificationRecipient.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
  const notificationIds = recipients.map(r => r.notificationId);
  const notifications = await Notification.find({ _id: { $in: notificationIds } }).lean().exec();
  // Map by id
  const mapById = notifications.reduce((acc, n) => ((acc[String(n._id)] = n), acc), {});
  return recipients.map(r => ({ recipient: r, notification: mapById[String(r.notificationId)] }));
}

async function markRead(userId, notificationId) {
  const recipient = await NotificationRecipient.findOneAndUpdate({ userId, notificationId }, { readAt: new Date() }, { new: true }).exec();
  if (!recipient) throw new Error('Notification recipient not found');
  return recipient;
}

async function markAllRead(userId) {
  const res = await NotificationRecipient.updateMany({ userId, readAt: null }, { readAt: new Date() }).exec();
  return res;
}

async function getUnreadCount(userId) {
  const count = await NotificationRecipient.countDocuments({ userId, readAt: null }).exec();
  return count;
}

module.exports = {
  createNotification,
  getNotificationsForUser,
  markRead,
  markAllRead,
  getUnreadCount,
};