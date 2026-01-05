const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Assessment Type Schema
 * Defines types of assessments (Quiz, Exam, Assignment, Project, etc.)
 */
const AssessmentTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: ["formative", "summative", "diagnostic", "other"],
            default: "formative",
        },
        weightage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        defaultDuration: {
            type: Number, // in minutes
            default: 60,
        },
        defaultTotalMarks: {
            type: Number,
            default: 100,
        },
        defaultPassingMarks: {
            type: Number,
            default: 40,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Multi-tenancy
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

// Compound index for unique assessment type names per school
AssessmentTypeSchema.index({ name: 1, schoolId: 1 }, { unique: true });

const AssessmentType = mongoose.models.AssessmentType || mongoose.model("AssessmentType", AssessmentTypeSchema);

module.exports = AssessmentType;
