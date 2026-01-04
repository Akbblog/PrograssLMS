const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const vehicleSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, enum: ['bus', 'van', 'car', 'minibus'], required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    driver: { type: ObjectId, ref: 'Teacher' },
    conductor: { type: ObjectId, ref: 'Teacher' },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    color: { type: String },
    insuranceNumber: { type: String },
    insuranceExpiry: { type: Date },
    fitnessExpiryDate: { type: Date },
    registrationNumber: { type: String },
    gpsTrackerId: { type: String },
    fuelType: { type: String, enum: ['diesel', 'petrol', 'cng', 'electric'] },
    status: { type: String, enum: ['active', 'maintenance', 'retired'], default: 'active' },
    images: [{ type: String }],
    notes: { type: String }
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
