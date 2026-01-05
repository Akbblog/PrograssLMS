const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const behaviorIncidentSchema = new mongoose.Schema({
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
    academicYear: {
        type: ObjectId,
        ref: "AcademicYear",
        required: true
    },
    // Incident details
    incidentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    reportedBy: {
        type: ObjectId,
        ref: "Teacher",
        required: true
    },
    incidentType: {
        type: String,
        enum: [
            "minor",           // Talking in class, unprepared
            "moderate",        // Disruption, disrespect
            "major",           // Fighting, bullying, cheating
            "critical"         // Violence, threats, illegal activities
        ],
        required: true
    },
    category: {
        type: String,
        enum: [
            "academic",        // Cheating, plagiarism
            "behavioral",      // Disruption, disrespect
            "safety",          // Fighting, threats
            "property",        // Damage to property
            "technology",      // Misuse of technology
            "attendance"       // Truancy, skipping
        ],
        required: true
    },
    // Detailed description
    description: {
        type: String,
        required: true
    },
    location: String,
    witnesses: [{
        name: String,
        role: String, // student, teacher, staff
        statement: String
    }],
    // Severity assessment
    severityLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    points: { // Behavior points system
        type: Number,
        default: function () {
            const pointsMap = { minor: 1, moderate: 3, major: 5, critical: 10 };
            return pointsMap[this.incidentType] || 1;
        }
    },
    // Intervention and consequences
    consequences: [{
        type: {
            type: String,
            enum: ["warning", "detention", "suspension", "parent-meeting", "counseling", "other"]
        },
        description: String,
        duration: String, // "1 day", "2 hours", etc.
        assignedBy: { type: ObjectId, ref: "Admin" },
        completed: { type: Boolean, default: false },
        completionDate: Date,
        notes: String
    }],
    // Parent communication
    parentNotified: { type: Boolean, default: false },
    parentNotificationDate: Date,
    parentResponse: {
        received: { type: Boolean, default: false },
        responseDate: Date,
        comments: String,
        actionPlan: String
    },
    // Resolution tracking
    status: {
        type: String,
        enum: ["reported", "under-review", "resolved", "escalated", "closed"],
        default: "reported"
    },
    resolutionDate: Date,
    resolvedBy: { type: ObjectId, ref: "Admin" },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date,
    // Preventive measures
    preventiveActions: [{
        action: String,
        assignedTo: { type: ObjectId, ref: "Teacher" },
        deadline: Date,
        status: { type: String, enum: ["pending", "in-progress", "completed"] }
    }],
    // Analytics fields
    recurrenceCount: { type: Number, default: 0 }, // How many times similar incident occurred
    trendAnalysis: String // "improving", "worsening", "stable"
}, {
    timestamps: true
});

// Pre-save middleware for automatic tracking
behaviorIncidentSchema.pre("save", async function (next) {
    // Calculate recurrence count for similar incidents
    if (this.isNew) {
        const similarIncidents = await this.constructor.find({
            student: this.student,
            incidentType: this.incidentType,
            category: this.category,
            _id: { $ne: this._id }
        });
        this.recurrenceCount = similarIncidents.length;
    }
    next();
});

// Method to escalate incident
behaviorIncidentSchema.methods.escalate = function (newSeverity, reason) {
    this.incidentType = newSeverity;
    this.severityLevel = Math.min(5, this.severityLevel + 1);
    this.consequences.push({
        type: "escalation",
        description: `Incident escalated: ${reason}`,
        assignedBy: this.reportedBy
    });
};

// Static method for behavior analytics
behaviorIncidentSchema.statics.getBehaviorAnalytics = async function (schoolId, academicYearId, timeframe = "monthly") {
    const incidents = await this.find({
        schoolId,
        academicYear: academicYearId
    }).populate('student', 'name currentClassLevel');

    const analytics = {
        totalIncidents: incidents.length,
        bySeverity: { minor: 0, moderate: 0, major: 0, critical: 0 },
        byCategory: {},
        byClass: {},
        trend: {},
        topStudents: []
    };

    incidents.forEach(incident => {
        // Severity breakdown
        analytics.bySeverity[incident.incidentType]++;

        // Category breakdown
        analytics.byCategory[incident.category] = (analytics.byCategory[incident.category] || 0) + 1;

        // Class-wise breakdown
        const className = incident.classLevel?.name || "Unknown";
        analytics.byClass[className] = (analytics.byClass[className] || 0) + 1;

        // Monthly trend
        const month = incident.incidentDate.getMonth();
        analytics.trend[month] = (analytics.trend[month] || 0) + 1;
    });

    // Identify students with most incidents
    const studentIncidents = {};
    incidents.forEach(incident => {
        const studentName = incident.student.name;
        studentIncidents[studentName] = (studentIncidents[studentName] || 0) + 1;
    });

    analytics.topStudents = Object.entries(studentIncidents)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([student, count]) => ({ student, count }));

    return analytics;
};

module.exports = mongoose.models.BehaviorIncident || mongoose.model("BehaviorIncident", behaviorIncidentSchema);
