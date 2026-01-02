const Attendance = require("../../models/Academic/Attendance.model");
const BehaviorIncident = require("../../models/Academic/BehaviorIncident.model");
const Student = require("../../models/Students/students.model");

class AttendanceBehaviorService {
    constructor(schoolId) {
        this.schoolId = schoolId;
    }

    // Comprehensive student behavior profile
    async getStudentBehaviorProfile(studentId, academicYearId) {
        const [attendance, incidents, student] = await Promise.all([
            Attendance.find({ student: studentId, academicYear: academicYearId }),
            BehaviorIncident.find({ student: studentId, academicYear: academicYearId }),
            Student.findById(studentId).populate('currentClassLevel')
        ]);

        const attendanceStats = await Attendance.calculateStudentStats(studentId, academicYearId);
        const behaviorScore = this.calculateBehaviorScore(incidents);
        const riskAssessment = this.assessRiskLevel(attendanceStats, incidents);

        return {
            student: {
                name: student.name,
                class: student.currentClassLevel?.name,
                enrollmentStatus: student.enrollmentStatus
            },
            attendance: attendanceStats,
            behavior: {
                totalIncidents: incidents.length,
                bySeverity: this.groupIncidentsBySeverity(incidents),
                behaviorScore,
                recentIncidents: incidents.slice(-5).map(i => ({
                    date: i.incidentDate,
                    type: i.incidentType,
                    description: i.description
                }))
            },
            riskAssessment,
            interventions: this.generateInterventions(attendanceStats, incidents, behaviorScore),
            trends: this.analyzeBehaviorTrends(incidents)
        };
    }

    calculateBehaviorScore(incidents) {
        if (incidents.length === 0) return 100;

        const totalPoints = incidents.reduce((sum, incident) => sum + incident.points, 0);
        const maxPossible = incidents.length * 10; // Assuming critical incidents are worst

        return Math.max(0, 100 - (totalPoints / maxPossible) * 100);
    }

    groupIncidentsBySeverity(incidents) {
        const groups = { minor: 0, moderate: 0, major: 0, critical: 0 };
        incidents.forEach(i => {
            if (groups[i.incidentType] !== undefined) groups[i.incidentType]++;
        });
        return groups;
    }

    assessRiskLevel(attendanceStats, incidents) {
        let riskScore = 0;

        // Attendance risk factors
        if (attendanceStats.attendanceRate < 80) riskScore += 20;
        if (attendanceStats.consecutiveAbsences >= 3) riskScore += 15;

        // Behavior risk factors
        const criticalIncidents = incidents.filter(i => i.incidentType === "critical").length;
        const majorIncidents = incidents.filter(i => i.incidentType === "major").length;

        riskScore += criticalIncidents * 30;
        riskScore += majorIncidents * 15;

        if (riskScore >= 50) return "high";
        if (riskScore >= 25) return "medium";
        return "low";
    }

    generateInterventions(attendanceStats, incidents, behaviorScore) {
        const interventions = [];

        // Attendance interventions
        if (attendanceStats.attendanceRate < 85) {
            interventions.push({
                type: "attendance",
                priority: attendanceStats.attendanceRate < 70 ? "high" : "medium",
                action: "Schedule meeting with student and parents",
                timeline: "Within 1 week"
            });
        }

        if (attendanceStats.consecutiveAbsences >= 3) {
            interventions.push({
                type: "attendance",
                priority: "high",
                action: "Immediate parent contact required",
                timeline: "Within 24 hours"
            });
        }

        // Behavior interventions
        if (behaviorScore < 70) {
            interventions.push({
                type: "behavior",
                priority: behaviorScore < 50 ? "high" : "medium",
                action: "Behavior monitoring program",
                timeline: "Ongoing"
            });
        }

        const recentMajorIncidents = incidents.filter(i =>
            i.incidentType === "major" || i.incidentType === "critical"
        ).length;

        if (recentMajorIncidents > 0) {
            interventions.push({
                type: "behavior",
                priority: "high",
                action: "Counseling session required",
                timeline: "Within 3 days"
            });
        }

        return interventions;
    }

    analyzeBehaviorTrends(incidents) {
        // Basic trend analysis
        if (incidents.length < 2) return "stable";

        const recent = incidents.slice(-5);
        const older = incidents.slice(-10, -5);

        if (older.length === 0) return "new-patterns";

        const recentSeverity = recent.reduce((sum, i) => sum + i.points, 0) / recent.length;
        const olderSeverity = older.reduce((sum, i) => sum + i.points, 0) / older.length;

        if (recentSeverity > olderSeverity * 1.2) return "worsening";
        if (recentSeverity < olderSeverity * 0.8) return "improving";
        return "stable";
    }

    // Automated alert system
    async generateBehaviorAlerts(academicYearId) {
        const students = await Student.find({
            schoolId: this.schoolId,
            enrollmentStatus: "active"
        });

        const alerts = [];

        for (const student of students) {
            const profile = await this.getStudentBehaviorProfile(student._id, academicYearId);

            if (profile.riskAssessment === "high") {
                alerts.push({
                    student: student.name,
                    studentId: student._id,
                    class: profile.student.class,
                    type: "behavior-risk",
                    severity: "high",
                    reasons: [
                        `Attendance rate: ${profile.attendance.attendanceRate.toFixed(1)}%`,
                        `Behavior score: ${profile.behavior.behaviorScore.toFixed(1)}`,
                        `Total incidents: ${profile.behavior.totalIncidents}`
                    ],
                    recommendedAction: "Immediate intervention required"
                });
            }

            // Attendance threshold alerts
            if (profile.attendance.attendanceRate < 75) {
                alerts.push({
                    student: student.name,
                    studentId: student._id,
                    class: profile.student.class,
                    type: "attendance-threshold",
                    severity: profile.attendance.attendanceRate < 60 ? "high" : "medium",
                    metric: `Attendance rate: ${profile.attendance.attendanceRate.toFixed(1)}%`,
                    threshold: 75,
                    recommendedAction: "Parent notification and support plan"
                });
            }
        }

        return alerts;
    }

    // Class-level behavior analytics
    async getClassBehaviorAnalytics(classLevelId, academicYearId) {
        const students = await Student.find({
            currentClassLevel: classLevelId,
            schoolId: this.schoolId,
            enrollmentStatus: "active"
        });

        const classAnalytics = {
            totalStudents: students.length,
            averageAttendance: 0,
            averageBehaviorScore: 0,
            riskDistribution: { low: 0, medium: 0, high: 0 },
            topConcerns: [],
            improvementAreas: []
        };

        if (students.length === 0) return classAnalytics;

        let totalAttendance = 0;
        let totalBehaviorScore = 0;

        for (const student of students) {
            const profile = await this.getStudentBehaviorProfile(student._id, academicYearId);
            totalAttendance += profile.attendance.attendanceRate;
            totalBehaviorScore += profile.behavior.behaviorScore;

            if (classAnalytics.riskDistribution[profile.riskAssessment] !== undefined) {
                classAnalytics.riskDistribution[profile.riskAssessment]++;
            }
        }

        classAnalytics.averageAttendance = totalAttendance / students.length;
        classAnalytics.averageBehaviorScore = totalBehaviorScore / students.length;

        return classAnalytics;
    }
}

module.exports = AttendanceBehaviorService;
