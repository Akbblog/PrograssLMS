const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
require("./GradingPolicy.model"); // Ensure model is registered

const gradeSchema = new mongoose.Schema(
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
        assessmentType: {
            type: String,
            enum: ["homework", "quiz", "exam", "project", "participation", "other"],
            required: true,
        },
        examName: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
        },
        maxScore: {
            type: Number,
            required: true,
            default: 100,
        },
        percentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        letterGrade: {
            type: String,
        },
        weight: {
            type: Number,
            min: 0,
            max: 100,
            default: function () {
                // Default weights based on assessment type
                const weights = {
                    homework: 20,
                    quiz: 30,
                    exam: 50,
                    project: 25,
                    participation: 10,
                    other: 100,
                };
                return weights[this.assessmentType] || 100;
            },
        },
        weightedScore: Number,
        isLate: { type: Boolean, default: false },
        latePenalty: { type: Number, default: 0 },
        attemptNumber: { type: Number, default: 1 },
        // Enhanced analytics
        classAverage: Number,
        classMedian: Number,
        classStandardDeviation: Number,
        percentileRank: Number,
        // Parent acknowledgment
        parentAcknowledged: { type: Boolean, default: false },
        acknowledgedAt: Date,
        remarks: String,
        teacher: {
            type: ObjectId,
            ref: "Teacher",
            required: true,
        },
        gradedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Enhanced pre-save logic
gradeSchema.pre("save", async function (next) {
    // Calculate percentage
    if (this.score && this.maxScore) {
        this.percentage = (this.score / this.maxScore) * 100;

        // Apply late penalty if applicable
        if (this.isLate && this.latePenalty > 0) {
            this.percentage = Math.max(0, this.percentage - this.latePenalty);
        }

        // Calculate weighted score
        this.weightedScore = (this.percentage * this.weight) / 100;

        // Get grading policy and calculate letter grade
        try {
            const GradingPolicy = mongoose.model("GradingPolicy");
            const policy = await GradingPolicy.findOne({
                schoolId: this.schoolId,
                academicYear: this.academicYear,
                isActive: true,
            });

            if (policy) {
                const gradeScale = policy.gradingScale.find(
                    (scale) =>
                        this.percentage >= scale.minPercentage &&
                        this.percentage <= scale.maxPercentage
                );
                this.letterGrade = gradeScale ? gradeScale.letter : "F";
            } else {
                // Fallback to default grading
                if (this.percentage >= 90) this.letterGrade = "A";
                else if (this.percentage >= 80) this.letterGrade = "B";
                else if (this.percentage >= 70) this.letterGrade = "C";
                else if (this.percentage >= 60) this.letterGrade = "D";
                else this.letterGrade = "F";
            }
        } catch (error) {
            console.error("Error calculating grade:", error);
        }
    }
    next();
});

// Static method to calculate class statistics
gradeSchema.statics.calculateClassStats = async function (
    classLevelId,
    subjectId,
    academicTermId
) {
    const grades = await this.find({
        classLevel: classLevelId,
        subject: subjectId,
        academicTerm: academicTermId,
    });

    const scores = grades.map((g) => g.percentage).filter((score) => score !== null);

    if (scores.length === 0) return null;

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const sorted = [...scores].sort((a, b) => a - b);
    const median =
        sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

    const variance =
        scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) /
        scores.length;
    const standardDeviation = Math.sqrt(variance);

    return { average, median, standardDeviation, totalStudents: scores.length };
};

// Index for efficient queries
gradeSchema.index({ student: 1, academicYear: 1, academicTerm: 1 });
gradeSchema.index({ subject: 1, classLevel: 1 });

module.exports = mongoose.model("Grade", gradeSchema);

