const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    // Roles targeted by this notification (e.g., ['admin','teacher'])
    targetRoles: {
      type: [String],
      default: [],
    },
    // Optional user who caused or owns this notification
    userId: {
      type: ObjectId,
      refPath: 'userModel',
      default: null,
    },
    // When userId is set, userModel indicates which collection to use (Admin, Teacher, Student, Parent)
    userModel: {
      type: String,
      enum: ['Admin', 'Teacher', 'Student', 'Parent', 'System'],
      default: 'System',
    },
    actionUrl: { type: String, default: '' },
    meta: { type: Object, default: {} },
    // Admins can mark notification type as enabled/disabled at creation time if desired
    disabled: { type: Boolean, default: false },
    // Multi-tenant: schoolId if applicable
    schoolId: { type: ObjectId, ref: 'School', default: null },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

const recipientSchema = new mongoose.Schema(
  {
    notificationId: { type: ObjectId, ref: 'Notification', required: true, index: true },
    userId: { type: ObjectId, required: true, index: true },
    userModel: { type: String, enum: ['Admin', 'Teacher', 'Student', 'Parent', 'System'], default: 'System' },
    readAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    // delivery status: pending, delivered, failed
    status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
    meta: { type: Object, default: {} },
    schoolId: { type: ObjectId, ref: 'School', default: null },
  },
  { timestamps: true }
);

recipientSchema.index({ userId: 1, readAt: 1 });

const NotificationRecipient = mongoose.model('NotificationRecipient', recipientSchema);

module.exports = {
  Notification,
  NotificationRecipient,
};