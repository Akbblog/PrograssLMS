const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const notificationsLib = require('../../../lib/notifications');
const eventBus = require('../../../utils/eventBus');
const { NotificationRecipient } = require('../../../models/notification.model');

// In-memory SSE connections: userId -> res
const sseConnections = new Map();

// Helper to send SSE message
function sendSSE(res, event, data) {
  try {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch (err) {
    // ignore
  }
}

// SSE endpoint for real-time updates
router.get('/stream', isLoggedIn, (req, res) => {
  const userId = req.userId;

  // Headers for SSE
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  sseConnections.set(String(userId), res);

  // Heartbeat
  const heartbeat = setInterval(() => {
    try { res.write(': keep-alive\n\n'); } catch (err) {}
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseConnections.delete(String(userId));
  });
});

// Listen to internal notification.created events to push to active SSE connections
eventBus.on('notification.created', ({ notification, recipients }) => {
  // recipients is an array of { notificationId, userId }
  recipients.forEach(async r => {
    const res = sseConnections.get(String(r.userId));
    if (res) {
      sendSSE(res, 'notification', { notification, recipient: r });
      // mark delivered
      try {
        await NotificationRecipient.updateOne({ _id: r._id }, { deliveredAt: new Date(), status: 'delivered' }).exec();
      } catch (err) {
        console.warn('[Notifications] Failed to mark delivered for recipient', r.userId, err.message);
      }
    }
  });
});

// Listen to chat message events and push to SSE connections for conversation participants
eventBus.on('communication.message.sent', ({ message, conversationId, recipients }) => {
  (recipients || []).forEach(r => {
    const res = sseConnections.get(String(r.userId));
    if (res) {
      sendSSE(res, 'message', { message, conversationId });
    }
  });
});

// List notifications (paginated)
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const items = await notificationsLib.getNotificationsForUser(req.userId, page, limit);
    return res.json({ status: 'ok', data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', message: err.message });
  }
});

router.get('/unread-count', isLoggedIn, async (req, res) => {
  try {
    const count = await notificationsLib.getUnreadCount(req.userId);
    res.json({ status: 'ok', data: { count } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', message: err.message });
  }
});

// Mark one as read
router.post('/mark-read', isLoggedIn, async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) return res.status(400).json({ status: 'failed', message: 'notificationId required' });
    const recipient = await notificationsLib.markRead(req.userId, notificationId);
    res.json({ status: 'ok', data: recipient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', message: err.message });
  }
});

// Mark all as read
router.post('/mark-all-read', isLoggedIn, async (req, res) => {
  try {
    const info = await notificationsLib.markAllRead(req.userId);
    res.json({ status: 'ok', data: info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', message: err.message });
  }
});

// Admin: Send broadcast notification
router.post('/send', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { title, message, type = 'info', targetRoles = [], actionUrl = '', meta = {}, schoolId = null } = req.body;
    if (!title || !message) return res.status(400).json({ status: 'failed', message: 'title & message required' });
    const result = await notificationsLib.createNotification({ title, message, type, targetRoles, actionUrl, meta, schoolId });
    res.json({ status: 'ok', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', message: err.message });
  }
});

module.exports = router;