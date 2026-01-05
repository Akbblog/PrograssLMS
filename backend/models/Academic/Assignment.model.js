const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const submissionSchema = new mongoose.Schema({
    student: {
        type: ObjectId,
        ref: "Student",
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    fileUrl: String,
    content: String,
    grade: {
        type: Number,
        min: 0,
        max: 100,
    },
    feedback: String,
    status: {
        type: String,
        enum: ["pending", "submitted", "graded", "late"],
        default: "pending",
    },
});

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        subject: {
            type: ObjectId,
            ref: "Subject",
            required: true,
        },
        classLevel: {
            type: ObjectId,
            ref: "ClassLevel",
            required: true,
        },
        teacher: {
            type: ObjectId,
            ref: "Teacher",
            required: true,
        },
        academicYear: {
            type: ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        academicTerm: {
            type: ObjectId,
            ref: "AcademicTerm",
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        totalPoints: {
            type: Number,
            default: 100,
        },
        attachments: [String],
        submissions: [submissionSchema],
        status: {
            type: String,
            enum: ["draft", "published", "closed"],
            default: "published",
        },
    },
    { timestamps: true }
);

// Index for efficient queries
assignmentSchema.index({ schoolId: 1, classLevel: 1, subject: 1 });
assignmentSchema.index({ dueDate: 1 });

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
