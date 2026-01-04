const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const kmReadingSchema = new mongoose.Schema({
  start: { type: Number },
  end: { type: Number }
});

const driverAttendanceSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    driver: { type: ObjectId, ref: 'Teacher', required: true },
    date: { type: Date, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    vehicle: { type: ObjectId, ref: 'Vehicle' },
    route: { type: ObjectId, ref: 'Route' },
    totalTrips: { type: Number, default: 0 },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' },
    kmReading: kmReadingSchema,
    fuelFilled: { type: Number },
    notes: { type: String }
  },
  { timestamps: true }
);

const DriverAttendance = mongoose.model('DriverAttendance', driverAttendanceSchema);
module.exports = DriverAttendance;