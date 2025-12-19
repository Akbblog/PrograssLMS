const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    emergencyContact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      relation: { type: String, default: "" },
    },
    studentId: {
      type: String,
      required: true,
      default: function () {
        return (
          "STU" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) +
          this.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        );
      },
    },
    role: {
      type: String,
      default: "student",
    },
    // Multi-tenancy: School this student belongs to
    schoolId: {
      type: ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    currentClassLevels: [
      {
        type: ObjectId,
        ref: "ClassLevel",
      },
    ],
    // Primary class assignment (for easier queries)
    currentClassLevel: {
      type: ObjectId,
      ref: "ClassLevel",
    },
    // Section within the class (A, B, C, etc.)
    section: {
      type: String,
      trim: true,
      uppercase: true,
    },
    // Roll number within class/section
    rollNumber: {
      type: String,
      trim: true,
    },
    // Enrollment status
    enrollmentStatus: {
      type: String,
      enum: ["active", "inactive", "graduated", "transferred", "withdrawn"],
      default: "active",
    },

    academicYear: {
      type: ObjectId,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },
    examResults: [
      {
        type: ObjectId,
        ref: "ExamResult",
      },
    ],
    program: {
      type: ObjectId,
      ref: "Program",
    },
    guardian: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: { type: Date },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    prefectName: {
      type: String,
    },
    // both are commented for future update
    // behaviorReport: [
    //   {
    //     type: ObjectId,
    //     ref: "BehaviorReport",
    //   },
    // ],
    // financialReport: [
    //   {
    //     type: ObjectId,
    //     ref: "FinancialReport",
    //   },
    // ],
    //year group
    yearGraduated: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
