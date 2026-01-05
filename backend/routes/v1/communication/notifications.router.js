const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const notificationsLib = require('../../../lib/notifications');
const eventBus = require('../../../utils/eventBus');
const { NotificationRecipient } = require('../../../models/notification.model');
const verifyToken = require('../../../utils/verifyToken');

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

// EventSource can't reliably send Authorization headers.
// Support token auth via query string for the SSE endpoint only.
function isLoggedInSSE(req, res, next) {
  const headerObj = req.headers || {};
  const authorization = headerObj.authorization || headerObj.Authorization;

  let token = null;
  if (authorization) {
    const parts = String(authorization).split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
  }

  if (!token && req.query && req.query.token) {
    const q = req.query.token;
    token = Array.isArray(q) ? q[0] : q;
  }

  if (typeof token === 'string') {
    token = token.trim();
    if (token.startsWith('Bearer ')) token = token.slice('Bearer '.length).trim();
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      token = token.slice(1, -1);
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, data: null, message: 'No token provided' });
  }

  const verify = verifyToken(token);
  if (verify && verify._id) {
    req.userAuth = {
      ...verify,
      id: verify._id,
      _id: verify._id,
    };
    req.userId = verify._id || verify.id;
    req.userRole = verify.role;
    req.schoolId = verify.schoolId || null;
    return next();
  }

  return res.status(401).json({ success: false, data: null, message: 'Invalid/expired token' });
}

// SSE endpoint for real-time updates
router.get('/stream', isLoggedInSSE, (req, res) => {
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