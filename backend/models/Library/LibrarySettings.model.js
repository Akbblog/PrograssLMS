const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const librarySettingsSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true, unique: true },
    maxBooksPerStudent: { type: Number, default: 3 },
    maxBooksPerTeacher: { type: Number, default: 5 },
    borrowingPeriodDays: { type: Number, default: 14 },
    renewalPeriodDays: { type: Number, default: 7 },
    finePerDay: { type: Number, default: 5 },
    renewalAllowed: { type: Boolean, default: true },
    maxRenewals: { type: Number, default: 2 },
    sendOverdueReminders: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 2 },
    createdBy: { type: ObjectId, ref: 'Admin' }
  },
  {
    timestamps: true,
  }
);

const LibrarySettings = mongoose.model('LibrarySettings', librarySettingsSchema);

module.exports = LibrarySettings;
