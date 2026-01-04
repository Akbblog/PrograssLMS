/**
 * Trigger all event types to verify notification listener flows.
 * Run: node scripts/trigger-notifications.js
 */
const dbConnect = require('../config/dbConnect');
const eventBus = require('../utils/eventBus');

async function run() {
  await dbConnect();

  console.log('Triggering events...');

  eventBus.dispatch('auth.login', { userId: '000000000000000000000001', role: 'teacher' });
  eventBus.dispatch('auth.passwordReset', { userId: '000000000000000000000002', role: 'student' });
  eventBus.dispatch('assignment.posted', { classId: 'class1', assignmentId: 'assign1', postedBy: 'teacher1' });
  eventBus.dispatch('assignment.graded', { assignmentId: 'assign1', gradedBy: 'teacher1' });
  eventBus.dispatch('user.created', { userId: '000000000000000000000003', role: 'student' });
  eventBus.dispatch('system.announcement', { title: 'Maintenance', message: 'Scheduled maintenance in 1 hour', targetRoles: ['admin','teacher','student'] });
  eventBus.dispatch('job.failure', { jobName: 'sync', detail: 'Failed to reach external API' });

  console.log('Done dispatching.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });