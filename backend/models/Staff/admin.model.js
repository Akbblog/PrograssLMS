const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    permissions: {
      type: Object,
      default: {
        manageStudents: true,
        manageTeachers: true,
        manageFees: true,
        viewReports: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    // Multi-tenancy: School this admin belongs to
    schoolId: {
      type: ObjectId,
      ref: "School",
      required: function () {
        // Only required if not super_admin
        return this.role !== "super_admin";
      },
    },
    // Who created this admin (for super_admin creating school admins)
    createdBy: {
      type: ObjectId,
      ref: "Admin",
    },
    academicTerms: [
      {
        type: ObjectId,
        ref: "AcademicTerm",
      },
    ],
    programs: [
      {
        type: ObjectId,
        ref: "Program",
      },
    ],
    yearGroups: [
      {
        type: ObjectId,
        ref: "YearGroup",
      },
    ],
    academicYears: [
      {
        type: ObjectId,
        ref: "AcademicYear",
      },
    ],
    classLevels: [
      {
        type: ObjectId,
        ref: "ClassLevel",
      },
    ],
    teachers: [
      {
        type: ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
