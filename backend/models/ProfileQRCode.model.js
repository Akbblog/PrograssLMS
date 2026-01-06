const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const profileQRCodeSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: false, index: true },
  entityType: { type: String, required: true }, // student|teacher|staff|other
  entityId: { type: ObjectId, required: true },
  qrCodeData: { type: String, required: true }, // encrypted payload
  qrCodeImage: { type: String }, // dataUrl or remote URL
  version: { type: Number, default: 1 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true },
  lastScannedAt: { type: Date }
}, { timestamps: true });

const ProfileQRCode = mongoose.models.ProfileQRCode || mongoose.model('ProfileQRCode', profileQRCodeSchema);
module.exports = ProfileQRCode;
