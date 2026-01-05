const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const academicTermSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "3 months",
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    // Multi-tenancy: School this belongs to
    schoolId: {
      type: ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const AcademicTerm = mongoose.models.AcademicTerm || mongoose.model("AcademicTerm", academicTermSchema);

module.exports = AcademicTerm;
