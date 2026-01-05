const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Lesson Schema
 * Individual lesson/content unit within a module
 */
const LessonSchema = new mongoose.Schema(
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
        // Lesson type
        type: {
            type: String,
            enum: ["video", "pdf", "text", "quiz", "assignment", "youtube"],
            required: true,
            default: "video",
        },
        // Content based on type
        content: {
            // For video/youtube type
            videoUrl: String,
            youtubeId: String, // YouTube video ID for embedding
            youtubeTitle: String,
            // For pdf type
            pdfUrl: String,
            // For text type (rich HTML content)
            htmlContent: String,
            // For quiz type
            quizId: {
                type: ObjectId,
                ref: "Exam",
            },
            // For assignment type
            assignmentId: {
                type: ObjectId,
                ref: "Assignment",
            },
        },
        // Duration in minutes
        duration: {
            type: Number,
            default: 0,
        },
        // Parent module
        module: {
            type: ObjectId,
            ref: "Module",
            required: true,
            index: true,
        },
        // Completion tracking
        completions: [{
            student: {
                type: ObjectId,
                ref: "Student",
            },
            completedAt: {
                type: Date,
                default: Date.now,
            },
            watchTime: Number, // For videos - how much they watched (seconds)
        }],
        // Settings
        isPreview: {
            type: Boolean,
            default: false, // Can be viewed without enrollment
        },
        isRequired: {
            type: Boolean,
            default: true,
        },
        // Resources/attachments
        resources: [{
            name: String,
            url: String,
            type: String, // pdf, doc, ppt, etc.
        }],
        // Multi-tenancy
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
LessonSchema.index({ module: 1, sequence: 1 });

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
