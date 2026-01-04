const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const payrollSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  staff: { type: ObjectId, ref: 'Teacher', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  earnings: { basic: Number, hra: Number, bonus: Number, totalEarnings: Number },
  deductions: { pf: Number, tax: Number, totalDeductions: Number },
  attendance: { presentDays: Number, leaveDays: Number },
  grossSalary: Number,
  netSalary: Number,
  paymentDate: Date,
  status: { type: String, enum: ['pending', 'processed', 'paid'], default: 'pending' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;