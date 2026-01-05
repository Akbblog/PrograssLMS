const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Course Schema
 * Main learning course container
 */
const CourseSchema = new mongoose.Schema(
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
        thumbnail: {
            type: String, // URL to thumbnail image
        },
        category: {
            type: String,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        // Academic links
        subject: {
            type: ObjectId,
            ref: "Subject",
        },
        classLevels: [{
            type: ObjectId,
            ref: "ClassLevel",
        }],
        // Instructor (Teacher)
        instructor: {
            type: ObjectId,
            ref: "Teacher",
        },
        // Course content structure
        modules: [{
            type: ObjectId,
            ref: "Module",
        }],
        // Course metadata
        estimatedHours: {
            type: Number,
            default: 0,
        },
        prerequisites: [{
            type: ObjectId,
            ref: "Course",
        }],
        tags: [{
            type: String,
            trim: true,
        }],
        // Status
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
        },
        // Enrollment tracking
        enrolledStudents: [{
            student: {
                type: ObjectId,
                ref: "Student",
            },
            enrolledAt: {
                type: Date,
                default: Date.now,
            },
            progress: {
                type: Number,
                default: 0,
            },
            completedAt: {
                type: Date,
            },
        }],
        // Settings
        settings: {
            allowEnrollment: { type: Boolean, default: true },
            requireCompletion: { type: Boolean, default: false }, // Must complete lessons in order
            showProgress: { type: Boolean, default: true },
            certificate: { type: Boolean, default: false },
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

// Indexes
CourseSchema.index({ title: "text", description: "text", instructor: "text" });
CourseSchema.index({ status: 1, schoolId: 1 });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

module.exports = Course;
