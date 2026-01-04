const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const appraisalSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  staff: { type: ObjectId, ref: 'Teacher', required: true },
  academicYear: { type: ObjectId, ref: 'AcademicYear' },
  reviewer: { type: ObjectId, ref: 'Teacher' },
  ratings: { jobKnowledge: Number, workQuality: Number, teamwork: Number, communication: Number },
  overallScore: Number,
  recommendations: String,
  status: { type: String, enum: ['draft', 'submitted', 'reviewed'], default: 'draft' }
}, { timestamps: true });

const Appraisal = mongoose.model('Appraisal', appraisalSchema);
module.exports = Appraisal;