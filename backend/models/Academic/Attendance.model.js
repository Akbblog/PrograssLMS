const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
    schoolId: {
        type: ObjectId,
        ref: "School",
        required: true,
        index: true
    },
    student: {
        type: ObjectId,
        ref: "Student",
        required: true
    },
    classLevel: {
        type: ObjectId,
        ref: "ClassLevel",
        required: true
    },
    subject: {
        type: ObjectId,
        ref: "Subject"
    },
    academicYear: {
        type: ObjectId,
        ref: "AcademicYear",
        required: true
    },
    academicTerm: {
        type: ObjectId,
        ref: "AcademicTerm",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // Enhanced status options
    status: {
        type: String,
        enum: ["present", "absent", "late", "early-departure", "excused", "suspended"],
        required: true
    },
    // Detailed tracking
    checkInTime: Date,
    checkOutTime: Date,
    duration: Number, // in minutes
    // Reason codes for absences
    absenceReason: {
        type: String,
        enum: ["sickness", "family-emergency", "appointment", "vacation", "other", "unknown"]
    },
    doctorNoteRequired: { type: Boolean, default: false },
    doctorNoteSubmitted: { type: Boolean, default: false },
    // Late arrival details
    lateMinutes: Number,
    lateReason: String,
    // Early departure details
    earlyDepartureReason: String,
    earlyDepartureMinutes: Number,
    // Teacher who marked attendance
    markedBy: { type: ObjectId, ref: "Teacher", required: true },
    // Parent acknowledgment
    parentAcknowledged: { type: Boolean, default: false },
    acknowledgedAt: Date,
    // Automated alerts
    alertsGenerated: [{ type: String, enum: ["absence-threshold", "pattern-detected", "doctor-note-reminder"] }],
    // Integration with behavior system
    behaviorIncident: { type: ObjectId, ref: "BehaviorIncident" }
}, {
    timestamps: true
});

// Pre-save to calculate duration and late minutes
attendanceSchema.pre("save", function (next) {
    if (this.checkInTime && this.checkOutTime) {
        this.duration = (this.checkOutTime - this.checkInTime) / (1000 * 60); // minutes
    }

    // Calculate late minutes if late
    if (this.status === "late" && this.checkInTime) {
        const expectedStart = new Date(this.date);
        expectedStart.setHours(8, 0, 0, 0); // Assuming 8 AM start
        this.lateMinutes = Math.max(0, (this.checkInTime - expectedStart) / (1000 * 60));
    }
    next();
});

// Indexes for efficient queries
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ classLevel: 1, date: 1 });
attendanceSchema.index({ schoolId: 1, academicYear: 1, academicTerm: 1 });

// Static method to calculate attendance statistics
attendanceSchema.statics.calculateStudentStats = async function (studentId, academicYearId, academicTermId = null) {
    const query = { student: studentId, academicYear: academicYearId };
    if (academicTermId) query.academicTerm = academicTermId;

    const attendances = await this.find(query);

    const totalDays = attendances.length;
    const presentDays = attendances.filter(a => a.status === "present").length;
    const absentDays = attendances.filter(a => a.status === "absent").length;
    const lateDays = attendances.filter(a => a.status === "late").length;
    const excusedDays = attendances.filter(a => a.status === "excused").length;

    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Pattern analysis
    const recentAttendances = attendances.slice(-10); // Last 10 records
    const recentPattern = recentAttendances.map(a => a.status);

    return {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendanceRate,
        recentPattern,
        trends: this.analyzeTrends(attendances)
    };
};

// Method to analyze attendance trends
attendanceSchema.statics.analyzeTrends = function (attendances) {
    const trends = {
        consecutiveAbsences: 0,
        consecutivePresents: 0,
        weeklyPattern: {},
        monthlyPattern: {}
    };

    let currentConsecutive = 0;
    let lastStatus = null;

    attendances.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(attendance => {
        // Consecutive analysis
        if (attendance.status === lastStatus) {
            currentConsecutive++;
        } else {
            if (lastStatus === "absent") {
                trends.consecutiveAbsences = Math.max(trends.consecutiveAbsences, currentConsecutive);
            } else if (lastStatus === "present") {
                trends.consecutivePresents = Math.max(trends.consecutivePresents, currentConsecutive);
            }
            currentConsecutive = 1;
            lastStatus = attendance.status;
        }

        // Weekly pattern (day of week)
        const dayOfWeek = new Date(attendance.date).getDay();
        if (!trends.weeklyPattern[dayOfWeek]) {
            trends.weeklyPattern[dayOfWeek] = { present: 0, total: 0 };
        }
        trends.weeklyPattern[dayOfWeek].total++;
        if (attendance.status === "present") {
            trends.weeklyPattern[dayOfWeek].present++;
        }
    });

    // Handle final sequence
    if (lastStatus === "absent") trends.consecutiveAbsences = Math.max(trends.consecutiveAbsences, currentConsecutive);
    if (lastStatus === "present") trends.consecutivePresents = Math.max(trends.consecutivePresents, currentConsecutive);

    return trends;
};

module.exports = mongoose.model("Attendance", attendanceSchema);
