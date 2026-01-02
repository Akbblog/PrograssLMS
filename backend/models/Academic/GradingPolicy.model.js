const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const gradingPolicySchema = new mongoose.Schema({
    schoolId: {
        type: ObjectId,
        ref: "School",
        required: true,
        index: true
    },
    policyName: {
        type: String,
        required: true,
        default: "Standard Grading Policy"
    },
    academicYear: {
        type: ObjectId,
        ref: "AcademicYear",
        required: true
    },
    assessmentWeights: {
        homework: { type: Number, min: 0, max: 100, default: 20 },
        quizzes: { type: Number, min: 0, max: 100, default: 30 },
        exams: { type: Number, min: 0, max: 100, default: 50 },
        projects: { type: Number, min: 0, max: 100, default: 25 },
        participation: { type: Number, min: 0, max: 100, default: 10 }
    },
    gradingScale: [{
        letter: { type: String, required: true }, // A+, A, A-, etc.
        minPercentage: { type: Number, required: true },
        maxPercentage: { type: Number, required: true },
        gradePoints: { type: Number, required: true }, // 4.0, 3.7, etc.
        description: String
    }],
    // Advanced grading rules
    lateSubmissionPolicy: {
        enabled: { type: Boolean, default: true },
        penaltyPerDay: { type: Number, default: 5 }, // percentage
        maxPenalty: { type: Number, default: 50 }
    },
    retakePolicy: {
        allowed: { type: Boolean, default: false },
        maxAttempts: { type: Number, default: 2 },
        highestScoreOnly: { type: Boolean, default: true }
    },
    curveGrading: {
        enabled: { type: Boolean, default: false },
        curveType: { type: String, enum: ["flat", "normal", "linear"], default: "flat" },
        targetAverage: { type: Number, default: 75 }
    },
    minimumPassingGrade: { type: Number, default: 60 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("GradingPolicy", gradingPolicySchema);
