const mongoose = require("mongoose");

const { ObjectId } = mongoose;

//questionSchema
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      index: true,
      text: true,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

module.exports = Question;
