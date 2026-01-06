const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

//examSchema
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: ObjectId,
      ref: "Subject",
      required: true,
    },
    program: {
      type: ObjectId,
      ref: "Program",
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    totalMark: {
      type: Number,
      required: true,
      default: 100,
    },
    duration: {
      type: String,
      required: true,
      default: "30 minutes",
    },
    examDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    examTime: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
      default: "Quiz",
    },
    examStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "live"],
    },
    questions: [
      {
        type: ObjectId,
        ref: "Question",
      },
    ],
    classLevel: {
      type: ObjectId,
      ref: "ClassLevel",
      required: true,
    },
    // Multi-tenancy: School this belongs to
    schoolId: {
      type: ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "Teacher",
      required: true,
    },
    academicTerm: {
      type: ObjectId,
      ref: "AcademicTerm",
      required: true,
    },
    academicYear: {
      type: ObjectId,
      ref: "AcademicYear",
      required: true,
    },
  },
  { timestamps: true }
);

// Add text index for search fields
examSchema.index({
  name: 'text',
  subject: 'text'
});

const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);

module.exports = Exam;
