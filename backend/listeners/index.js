const AdminListener = require('./admin.listener');
const StudentListener = require('./student.listener');
const LoggerListener = require('./logger.listener');
const SchoolListener = require('./school.listener');
const NotificationListener = require('./notification.listener');

/**
 * All listeners that should be registered with the EventBus
 */
const listeners = [
    AdminListener,
    StudentListener,
    LoggerListener,
    SchoolListener,
    NotificationListener,
    // Add more listeners here
];

module.exports = listeners;
