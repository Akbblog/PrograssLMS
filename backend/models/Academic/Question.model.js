const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * QuestionBank Schema
 * Stores questions for assessments with support for multimedia
 */
const QuestionBankSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true,
        },
        questionType: {
            type: String,
            enum: ["mcq", "true-false", "short", "long", "fill-blank", "matching"],
            required: true,
            default: "mcq",
        },
        // For MCQ questions
        options: [{
            text: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
        }],
        // For non-MCQ questions
        correctAnswer: {
            type: String,
        },
        // Answer explanation (shown after answering)
        explanation: {
            type: String,
        },
        marks: {
            type: Number,
            required: true,
            default: 1,
        },
        negativeMark: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },
        // Academic references
        subject: {
            type: ObjectId,
            ref: "Subject",
        },
        classLevel: {
            type: ObjectId,
            ref: "ClassLevel",
        },
        // Tags for organization
        tags: [{
            type: String,
            trim: true,
        }],
        // Media content (images, videos, YouTube)
        media: [{
            type: {
                type: String,
                enum: ["image", "video", "youtube", "audio", "pdf"],
            },
            url: String,
            title: String,
            startTime: Number, // For video - where in video to start (seconds)
            endTime: Number,   // For video - where to end
        }],
        // Hints (optional)
        hints: [{
            text: String,
            penalty: { type: Number, default: 0 }, // Marks deducted for using hint
        }],
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
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes
QuestionBankSchema.index({ subject: 1, schoolId: 1 });
QuestionBankSchema.index({ tags: 1 });
QuestionBankSchema.index({ difficulty: 1 });

const QuestionBank = mongoose.models.QuestionBank || mongoose.model("QuestionBank", QuestionBankSchema);

module.exports = QuestionBank;
