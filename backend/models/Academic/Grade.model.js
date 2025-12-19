const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
        examType: {
            type: String,
            enum: ["quiz", "midterm", "final", "assignment", "project", "other"],
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
            enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
        },
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

// Calculate percentage before saving
gradeSchema.pre("save", function (next) {
    if (this.score && this.maxScore) {
        this.percentage = (this.score / this.maxScore) * 100;

        // Calculate letter grade
        if (this.percentage >= 97) this.letterGrade = "A+";
        else if (this.percentage >= 93) this.letterGrade = "A";
        else if (this.percentage >= 90) this.letterGrade = "A-";
        else if (this.percentage >= 87) this.letterGrade = "B+";
        else if (this.percentage >= 83) this.letterGrade = "B";
        else if (this.percentage >= 80) this.letterGrade = "B-";
        else if (this.percentage >= 77) this.letterGrade = "C+";
        else if (this.percentage >= 73) this.letterGrade = "C";
        else if (this.percentage >= 70) this.letterGrade = "C-";
        else if (this.percentage >= 60) this.letterGrade = "D";
        else this.letterGrade = "F";
    }
    next();
});

// Index for efficient queries
gradeSchema.index({ student: 1, academicYear: 1, academicTerm: 1 });
gradeSchema.index({ subject: 1, classLevel: 1 });

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;
