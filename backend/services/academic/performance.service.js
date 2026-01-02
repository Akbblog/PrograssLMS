const Grade = require("../../models/Academic/Grade.model");
const Student = require("../../models/Students/students.model");
const Attendance = require("../../models/Academic/Attendance.model");
const AcademicTerm = require("../../models/Academic/academicTerm.model");

class PerformanceService {
    constructor(schoolId) {
        this.schoolId = schoolId;
    }

    // Calculate overall student performance
    async calculateStudentPerformance(studentId, academicYearId, academicTermId) {
        const grades = await Grade.find({
            student: studentId,
            academicYear: academicYearId,
            academicTerm: academicTermId
        }).populate('subject');

        // Query attendance documents where the student is in the records array
        const attendanceDocs = await Attendance.find({
            "records.student": studentId,
            academicYear: academicYearId,
            academicTerm: academicTermId
        });

        // Calculate subject-wise performance
        const subjectPerformance = {};
        let totalWeightedScore = 0;
        let totalWeight = 0;

        grades.forEach(grade => {
            const subjectName = grade.subject?.name || 'Unknown';
            if (!subjectPerformance[subjectName]) {
                subjectPerformance[subjectName] = {
                    totalScore: 0,
                    totalWeight: 0,
                    grades: []
                };
            }

            subjectPerformance[subjectName].totalScore += grade.weightedScore || 0;
            subjectPerformance[subjectName].totalWeight += grade.weight || 0;
            subjectPerformance[subjectName].grades.push(grade);

            totalWeightedScore += grade.weightedScore || 0;
            totalWeight += grade.weight || 0;
        });

        // Calculate overall GPA
        const overallPercentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

        // Attendance analysis
        const totalDays = attendanceDocs.length;
        let presentDays = 0;
        attendanceDocs.forEach(doc => {
            const record = doc.records.find(r => r.student.toString() === studentId.toString());
            if (record && record.status === 'present') {
                presentDays++;
            }
        });
        const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        // Performance trends
        const performanceTrend = await this.calculatePerformanceTrend(studentId, academicYearId);

        return {
            overallPercentage,
            gpa: this.calculateGPA(overallPercentage),
            attendanceRate,
            subjectPerformance,
            totalSubjects: Object.keys(subjectPerformance).length,
            performanceTrend,
            recommendations: this.generateRecommendations(overallPercentage, attendanceRate)
        };
    }

    calculateGPA(percentage) {
        if (percentage >= 90) return 4.0;
        if (percentage >= 80) return 3.0;
        if (percentage >= 70) return 2.0;
        if (percentage >= 60) return 1.0;
        return 0.0;
    }

    async calculatePerformanceTrend(studentId, academicYearId) {
        // Calculate performance trend across terms
        const terms = await AcademicTerm.find({ academicYear: academicYearId }).sort('startDate');
        const trend = [];

        for (const term of terms) {
            const grades = await Grade.find({ student: studentId, academicTerm: term._id });
            const average = grades.length > 0 ?
                grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length : 0;
            trend.push({ term: term.name, average });
        }

        return trend;
    }

    generateRecommendations(percentage, attendanceRate) {
        const recommendations = [];

        if (percentage < 70) {
            recommendations.push("Consider additional tutoring sessions");
            recommendations.push("Focus on improving homework completion");
        }

        if (attendanceRate < 85) {
            recommendations.push("Improve attendance to enhance learning");
        }

        if (percentage >= 90 && attendanceRate >= 95) {
            recommendations.push("Excellent performance! Consider advanced courses");
        }

        return recommendations;
    }

    // Class-level analytics
    async calculateClassPerformance(classLevelId, subjectId, academicTermId) {
        const students = await Student.find({
            currentClassLevel: classLevelId,
            schoolId: this.schoolId,
            enrollmentStatus: 'active'
        });

        const classPerformance = {
            totalStudents: students.length,
            averageScore: 0,
            performanceDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
            topPerformers: [],
            strugglingStudents: []
        };

        let totalScore = 0;
        let count = 0;

        for (const student of students) {
            const grades = await Grade.find({
                student: student._id,
                subject: subjectId,
                academicTerm: academicTermId
            });

            if (grades.length > 0) {
                const studentAverage = grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length;
                totalScore += studentAverage;
                count++;

                // Categorize performance
                if (studentAverage >= 90) classPerformance.performanceDistribution.A++;
                else if (studentAverage >= 80) classPerformance.performanceDistribution.B++;
                else if (studentAverage >= 70) classPerformance.performanceDistribution.C++;
                else if (studentAverage >= 60) classPerformance.performanceDistribution.D++;
                else classPerformance.performanceDistribution.F++;

                // Identify top performers and struggling students
                if (studentAverage >= 85) {
                    classPerformance.topPerformers.push({
                        student: student.name,
                        score: studentAverage,
                        studentId: student._id
                    });
                } else if (studentAverage < 60) {
                    classPerformance.strugglingStudents.push({
                        student: student.name,
                        score: studentAverage,
                        studentId: student._id
                    });
                }
            }
        }

        classPerformance.averageScore = count > 0 ? totalScore / count : 0;

        // Sort top performers and struggling students
        classPerformance.topPerformers.sort((a, b) => b.score - a.score);
        classPerformance.strugglingStudents.sort((a, b) => a.score - b.score);

        return classPerformance;
    }
}

module.exports = PerformanceService;
