const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const studentQRCodeSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  student: { type: ObjectId, ref: 'Student', required: true },
  qrCodeData: { type: String, required: true }, // encrypted payload
  qrCodeImage: { type: String }, // URL or base64
  version: { type: Number, default: 1 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true },
  lastScannedAt: { type: Date }
}, { timestamps: true });

const StudentQRCode = mongoose.model('StudentQRCode', studentQRCodeSchema);
module.exports = StudentQRCode;