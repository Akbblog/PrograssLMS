const notifications = require('../lib/notifications');

function register(eventBus) {
  // Authentication events
  eventBus.on('auth.login', async ({ userId, role }) => {
    await notifications.createNotification({
      title: 'New login',
      message: `A successful login was recorded for ${role}.`,
      type: 'info',
      targetRoles: [],
      userId,
      userModel: role === 'admin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1),
      actionUrl: '/account/sessions',
    });
  });

  eventBus.on('auth.passwordReset', async ({ userId, role }) => {
    await notifications.createNotification({
      title: 'Password Reset',
      message: `Password reset for ${role}.`,
      type: 'warning',
      userId,
      userModel: role === 'admin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1),
      actionUrl: '/account/reset',
    });
  });

  // Academic flows
  eventBus.on('assignment.posted', async ({ classId, assignmentId, postedBy, schoolId }) => {
    await notifications.createNotification({
      title: 'Assignment Posted',
      message: `A new assignment was posted.`,
      type: 'info',
      targetRoles: ['student', 'parent'],
      actionUrl: `/assignments/${assignmentId}`,
      schoolId,
    });
  });

  eventBus.on('assignment.graded', async ({ assignmentId, gradedBy, schoolId }) => {
    await notifications.createNotification({
      title: 'Assignment Graded',
      message: `An assignment has been graded.`,
      type: 'success',
      targetRoles: ['student'],
      actionUrl: `/assignments/${assignmentId}`,
      schoolId,
    });
  });

  // User management
  eventBus.on('user.created', async ({ userId, role, schoolId }) => {
    await notifications.createNotification({
      title: 'User Created',
      message: `A new ${role} account was created.`,
      type: 'info',
      targetRoles: ['admin'],
      actionUrl: '/admin/users',
      schoolId,
    });
  });

  eventBus.on('user.disabled', async ({ userId, role, schoolId }) => {
    await notifications.createNotification({
      title: 'User Disabled',
      message: `A ${role} account was disabled.`,
      type: 'warning',
      targetRoles: ['admin'],
      actionUrl: '/admin/users',
      schoolId,
    });
  });

  // System
  eventBus.on('system.announcement', async ({ title, message, targetRoles = ['admin','teacher','student','parent'], actionUrl = '/', schoolId }) => {
    await notifications.createNotification({
      title,
      message,
      type: 'info',
      targetRoles,
      actionUrl,
      schoolId,
    });
  });

  // Background job alerts
  eventBus.on('job.success', async ({ jobName, detail, admins = [], schoolId }) => {
    await notifications.createNotification({
      title: `Job ${jobName} succeeded`,
      message: detail || 'Background job completed successfully.',
      type: 'success',
      targetRoles: ['admin'],
      actionUrl: '/admin/jobs',
      schoolId,
    });
  });

  eventBus.on('job.failure', async ({ jobName, detail, admins = [], schoolId }) => {
    await notifications.createNotification({
      title: `Job ${jobName} failed`,
      message: detail || 'Background job failed.',
      type: 'error',
      targetRoles: ['admin'],
      actionUrl: '/admin/jobs',
      schoolId,
    });
  });

  console.log('[NotificationListener] Registered handlers');
}

module.exports = { register };
