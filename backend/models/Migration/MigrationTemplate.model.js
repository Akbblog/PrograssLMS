const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const mappingSchema = new mongoose.Schema({ sourceField: String, targetField: String, transformation: String, defaultValue: mongoose.Mixed }, { _id: false });

const migrationTemplateSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true },
  entityType: { type: String, enum: ['students', 'staff', 'fees', 'attendance'], required: true },
  fieldMappings: [mappingSchema],
  validationRules: { type: Object },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const MigrationTemplate = mongoose.model('MigrationTemplate', migrationTemplateSchema);
module.exports = MigrationTemplate;