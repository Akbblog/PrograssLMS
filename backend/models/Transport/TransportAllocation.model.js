const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const transportAllocationSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    student: { type: ObjectId, ref: 'Student', required: true },
    route: { type: ObjectId, ref: 'Route', required: true },
    stop: { type: String, required: true },
    vehicleAssigned: { type: ObjectId, ref: 'Vehicle' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    monthlyFee: { type: Number, required: true },
    pickupType: { type: String, enum: ['pickup-only', 'drop-only', 'both'], default: 'both' },
    status: { type: String, enum: ['active', 'suspended', 'terminated'], default: 'active' },
    emergencyContact: { type: String },
    specialInstructions: { type: String }
  },
  { timestamps: true }
);

const TransportAllocation = mongoose.model('TransportAllocation', transportAllocationSchema);
module.exports = TransportAllocation;
