const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaveBalanceSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  staff: { type: ObjectId, ref: 'Teacher', required: true },
  academicYear: { type: ObjectId, ref: 'AcademicYear' },
  balances: [{ leaveType: { type: ObjectId, ref: 'LeaveType' }, entitled: Number, taken: Number, balance: Number }]
}, { timestamps: true });

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);
module.exports = LeaveBalance;