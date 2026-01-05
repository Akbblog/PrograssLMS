const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: ObjectId,
            ref: "Student",
            required: true,
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
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "completed", "dropped", "transferred"],
            default: "active",
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index(
    { student: 1, subject: 1, academicYear: 1, academicTerm: 1 },
    { unique: true }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
