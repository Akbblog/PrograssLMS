const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cardFieldSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  label: { type: String, required: true },
  show: { type: Boolean, default: true },
  section: { type: String, enum: ['left', 'right', 'center', 'header', 'footer'], default: 'left' },
  order: { type: Number, default: 0 },
  fontSize: { type: Number, default: 10 },
  fontFamily: { type: String, default: 'Helvetica' },
  fontColor: { type: String, default: '#000000' },
  bold: { type: Boolean, default: false },
  alignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
  maxWidth: { type: Number, default: 0 },
}, { _id: false });

const cardTemplateSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true, trim: true },
  entityType: { type: String, enum: ['student', 'teacher'], required: true },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: false },

  // Layout
  layout: {
    orientation: { type: String, enum: ['portrait', 'landscape'], default: 'landscape' },
    width: { type: Number, default: 85.6 },   // mm standard ID card
    height: { type: Number, default: 53.98 },  // mm standard ID card
    showQRCode: { type: Boolean, default: true },
    qrPosition: { type: String, enum: ['top-right', 'bottom-right', 'bottom-left', 'center'], default: 'bottom-right' },
    showPhoto: { type: Boolean, default: true },
    photoPosition: { type: String, enum: ['top-left', 'top-right', 'top-center'], default: 'top-right' },
    showSignature: { type: Boolean, default: false },
    showSchoolLogo: { type: Boolean, default: true },
  },

  // Styling
  styling: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    accentColor: { type: String, default: '#F59E0B' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    backgroundImage: { type: String, default: '' },
    backgroundOpacity: { type: Number, default: 1, min: 0, max: 1 },
    borderRadius: { type: Number, default: 8 },
    borderColor: { type: String, default: '#E5E7EB' },
    borderWidth: { type: Number, default: 1 },
    headerStyle: { type: String, enum: ['gradient', 'solid', 'none'], default: 'gradient' },
  },

  // Fields
  fields: [cardFieldSchema],

  // Custom text overlays
  customText: {
    header: { type: String, default: '' },
    footer: { type: String, default: '' },
    watermark: { type: String, default: '' },
  },

  // Preview cache
  preview: {
    dataUrl: { type: String, default: '' },
    generatedAt: { type: Date },
  },

  createdBy: { type: ObjectId, ref: 'Admin' },
}, { timestamps: true });

// Compound index for quick active template lookup
cardTemplateSchema.index({ schoolId: 1, entityType: 1, isActive: 1 });
cardTemplateSchema.index({ schoolId: 1, entityType: 1, version: -1 });

const CardTemplate = mongoose.models.CardTemplate || mongoose.model('CardTemplate', cardTemplateSchema);
module.exports = CardTemplate;
