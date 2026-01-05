const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const attendanceDeviceSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  deviceId: { type: String, required: true, unique: true },
  deviceName: { type: String },
  location: { type: String },
  deviceType: { type: String, enum: ['scanner', 'kiosk', 'mobile'], default: 'scanner' },
  assignedTo: { type: ObjectId, ref: 'Teacher' },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  lastSync: Date,
  lastHeartbeat: Date,
  meta: { type: Object }
}, { timestamps: true });

const AttendanceDevice = mongoose.models.AttendanceDevice || mongoose.model('AttendanceDevice', attendanceDeviceSchema);
module.exports = AttendanceDevice;