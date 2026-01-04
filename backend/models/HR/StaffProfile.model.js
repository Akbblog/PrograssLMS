const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const staffProfileSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  user: { type: ObjectId, ref: 'Teacher' },
  employeeId: { type: String, required: true, index: true },
  designation: { type: String },
  department: { type: String },
  joiningDate: Date,
  employmentType: { type: String, enum: ['permanent', 'contract', 'temporary'] },
  salary: {
    basic: Number,
    hra: Number,
    conveyance: Number,
    deductions: Number,
    netSalary: Number
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  emergencyContact: String,
  documents: [{ type: String }],
  status: { type: String, enum: ['active', 'on-leave', 'terminated'], default: 'active' }
}, { timestamps: true });

const StaffProfile = mongoose.model('StaffProfile', staffProfileSchema);
module.exports = StaffProfile;