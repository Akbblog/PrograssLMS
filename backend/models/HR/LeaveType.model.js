const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaveTypeSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true },
  code: { type: String },
  allowedDays: { type: Number, default: 0 },
  carryForward: { type: Boolean, default: false },
  encashable: { type: Boolean, default: false },
  applicableTo: { type: String, enum: ['teaching', 'non-teaching', 'all'], default: 'all' },
  isPaid: { type: Boolean, default: true }
}, { timestamps: true });

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
module.exports = LeaveType;