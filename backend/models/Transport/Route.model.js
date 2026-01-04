const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const stopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  address: { type: String },
  pickupTime: { type: String },
  dropTime: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  sequence: { type: Number, required: true }
});

const routeSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    routeName: { type: String, required: true },
    routeCode: { type: String, required: true },
    vehicle: { type: ObjectId, ref: 'Vehicle' },
    stops: [stopSchema],
    distanceKm: { type: Number },
    estimatedDurationMinutes: { type: Number },
    monthlyFee: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
