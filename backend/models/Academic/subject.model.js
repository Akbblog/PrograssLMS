const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    teacher: {
      type: ObjectId,
      ref: "Teacher",
    },
    academicTerm: {
      type: ObjectId,
      ref: "AcademicTerm",
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
    duration: {
      type: String,
      default: "3 months",
    },
  },
  { timestamps: true }
);

const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

module.exports = Subject;

