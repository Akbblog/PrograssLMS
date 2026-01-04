const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const documentTemplateSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  templateType: { type: String, required: true },
  templateName: { type: String, required: true },
  headerConfig: { logo: String, schoolName: String, address: String, contact: String },
  footerConfig: { text: String, showPageNumber: { type: Boolean, default: true } },
  watermark: String,
  primaryColor: String,
  fontFamily: String,
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: ObjectId, ref: 'Admin' }
}, { timestamps: true });

const DocumentTemplate = mongoose.model('DocumentTemplate', documentTemplateSchema);
module.exports = DocumentTemplate;