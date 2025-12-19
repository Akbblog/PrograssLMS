const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const attendanceSchema = new mongoose.Schema(
    {
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
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
        classLevel: {
            type: ObjectId,
            ref: "ClassLevel",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        records: [
            {
                student: {
                    type: ObjectId,
                    ref: "Student",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["present", "absent", "late", "excused"],
                    default: "present",
                },
                remarks: {
                    type: String,
                },
            },
        ],
        takenBy: {
            type: ObjectId,
            ref: "Teacher", // or Admin
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate attendance for same class on same date
attendanceSchema.index({ schoolId: 1, classLevel: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
