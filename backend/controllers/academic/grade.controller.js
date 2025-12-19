const Grade = require("../../models/Academic/Grade.model");

// Create Grade
exports.createGrade = async (req, res) => {
    try {
        const { student, subject, classLevel, academicYear, academicTerm, examType, examName, score, maxScore, remarks } = req.body;
        const schoolId = req.schoolId;
        const teacher = req.userId;

        const grade = await Grade.create({
            student,
            subject,
            classLevel,
            academicYear,
            academicTerm,
            examType,
            examName,
            score,
            maxScore: maxScore || 100,
            remarks,
            teacher,
            schoolId,
        });

        res.status(201).json({
            status: "success",
            data: grade,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Student Grades
exports.getStudentGrades = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { academicYear, academicTerm, subject } = req.query;
        const schoolId = req.schoolId;

        let query = { student: studentId, schoolId };
        if (academicYear) query.academicYear = academicYear;
        if (academicTerm) query.academicTerm = academicTerm;
        if (subject) query.subject = subject;

        const grades = await Grade.find(query)
            .populate("subject", "name")
            .populate("teacher", "name")
            .populate("academicYear", "name")
            .populate("academicTerm", "name")
            .sort({ gradedAt: -1 });

        // Calculate overall average
        const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0);
        const average = grades.length > 0 ? totalPercentage / grades.length : 0;

        res.status(200).json({
            status: "success",
            data: {
                grades,
                average: average.toFixed(2),
                totalGrades: grades.length,
            },
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Class Grades (Teacher/Admin)
exports.getClassGrades = async (req, res) => {
    try {
        const { classLevel, subject } = req.query;
        const schoolId = req.schoolId;

        const query = { schoolId };
        if (classLevel) query.classLevel = classLevel;
        if (subject) query.subject = subject;

        const grades = await Grade.find(query)
            .populate("student", "name studentId")
            .populate("subject", "name")
            .sort({ student: 1, gradedAt: -1 });

        res.status(200).json({
            status: "success",
            data: grades,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
