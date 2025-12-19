const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const teacherAttendanceSchema = new mongoose.Schema(
    {
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        records: [
            {
                teacher: {
                    type: ObjectId,
                    ref: "Teacher",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["present", "absent", "late", "leave", "half-day"],
                    default: "present",
                },
                checkInTime: {
                    type: String,
                },
                checkOutTime: {
                    type: String,
                },
                remarks: {
                    type: String,
                },
            },
        ],
        takenBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate attendance for same school on same date
teacherAttendanceSchema.index({ schoolId: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.model("TeacherAttendance", teacherAttendanceSchema);

module.exports = TeacherAttendance;
