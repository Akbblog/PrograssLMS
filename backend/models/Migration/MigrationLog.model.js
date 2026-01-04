const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const migrationLogSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  migrationId: { type: String, required: true, index: true },
  entityType: { type: String },
  fileName: { type: String },
  totalRecords: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  errorCount: { type: Number, default: 0 },
  errors: [{ row: Number, field: String, message: String }],
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  startedAt: Date,
  completedAt: Date,
  performedBy: { type: ObjectId, ref: 'Admin' }
}, { timestamps: true });

const MigrationLog = mongoose.model('MigrationLog', migrationLogSchema);
module.exports = MigrationLog;