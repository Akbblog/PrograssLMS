const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cardCustomizationSchema = new mongoose.Schema({
  schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
  adminId: { type: ObjectId, ref: 'Admin' },
  templateId: { type: ObjectId, ref: 'CardTemplate' },

  // Field value mappings (map standard fields to school-specific data paths)
  fieldMappings: { type: Map, of: String, default: {} },

  // Hidden fields per card type
  hiddenFields: [{ type: String }],

  // Custom text overlays
  customText: {
    header: { type: String, default: '' },
    footer: { type: String, default: '' },
    watermark: { type: String, default: '' },
  },
}, { timestamps: true });

cardCustomizationSchema.index({ schoolId: 1, templateId: 1 }, { unique: true });

const CardCustomization = mongoose.models.CardCustomization || mongoose.model('CardCustomization', cardCustomizationSchema);
module.exports = CardCustomization;
