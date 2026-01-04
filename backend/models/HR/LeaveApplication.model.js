const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaveApplicationSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  staff: { type: ObjectId, ref: 'Teacher', required: true },
  leaveType: { type: ObjectId, ref: 'LeaveType', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  totalDays: { type: Number },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: ObjectId, ref: 'Admin' },
  remarks: { type: String }
}, { timestamps: true });

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
module.exports = LeaveApplication;