const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const staffProfileSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  user: { type: ObjectId, ref: 'Teacher' }, // Link to auth user if applicable
  
  employeeId: { type: String, required: true, unique: true, index: true },
  
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    photo: String, 
    nationalId: { type: String, required: true },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] }
  },

  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },

  employmentInfo: {
    department: { type: String, enum: ['teaching', 'administration', 'support', 'management'], required: true },
    designation: { type: String, required: true },
    employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'temporary'], required: true },
    joiningDate: { type: Date, required: true },
    reportingTo: { type: ObjectId, ref: 'StaffProfile' },
    workLocation: String,
    shift: String
  },

  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    grade: String
  }],

  documents: [{
    type: { type: String, enum: ['resume', 'id_proof', 'address_proof', 'qualification', 'other'] },
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  bankDetails: {
    accountNumber: String,
    bankName: String,
    branchName: String,
    ifscCode: String
  },

  salary: {
    basicSalary: { type: Number, default: 0 },
    allowances: [{
      type: { type: String }, // e.g. HRA, Transport
      amount: Number
    }],
    deductions: [{
      type: { type: String },
      amount: Number
    }]
  },

  status: { type: String, enum: ['active', 'on_leave', 'suspended', 'terminated', 'resigned'], default: 'active' }

}, { timestamps: true });

// Add text index for search fields
staffProfileSchema.index({
  'personalInfo.firstName': 'text',
  'personalInfo.lastName': 'text',
  'contactInfo.email': 'text',
  'employmentInfo.department': 'text',
  'employmentInfo.designation': 'text'
});

const StaffProfile = mongoose.model('StaffProfile', staffProfileSchema);
module.exports = StaffProfile;