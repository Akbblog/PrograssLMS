const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Module Schema
 * A module is a section within a course containing lessons
 */
const ModuleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        sequence: {
            type: Number,
            required: true,
            default: 0,
        },
        // Parent course
        course: {
            type: ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },
        // Lessons in this module
        lessons: [{
            type: ObjectId,
            ref: "Lesson",
        }],
        // Duration in minutes (calculated from lessons)
        duration: {
            type: Number,
            default: 0,
        },
        // Module completion requirements
        isRequired: {
            type: Boolean,
            default: true,
        },
        // Multi-tenancy (inherited from course but stored for query efficiency)
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Compound index
ModuleSchema.index({ course: 1, sequence: 1 });

const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;
