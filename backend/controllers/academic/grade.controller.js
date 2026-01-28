const responseStatus = require("../../handlers/responseStatus.handler");

// Helper function to calculate grade
function calculateGrade(score, maxScore = 100) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
}

// Create Grade
exports.createGrade = async (req, res) => {
    try {
        const {
            student,
            subject,
            classLevel,
            academicYear,
            academicTerm,
            assessmentType, // Changed from examType
            examName,
            score,
            maxScore,
            remarks,
            weight,
            isLate,
            latePenalty,
            attemptNumber
        } = req.body;
        const schoolId = req.schoolId;
        const teacher = req.userId;

        // Use Prisma if enabled
        if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            
            const grade = await prisma.result.create({
                data: {
                    studentId: student,
                    examName: examName,
                    score: score,
                    grade: calculateGrade(score, maxScore || 100),
                    passMark: maxScore ? maxScore * 0.6 : 60,
                    status: 'graded',
                    remarks: remarks,
                    classLevel: classLevel,
                    academicTerm: academicTerm,
                    academicYear: academicYear,
                    isPublished: true,
                    schoolId: schoolId
                }
            });
            
            await prisma.$disconnect();
            
            return res.status(201).json({
                status: "success",
                data: grade,
            });
        } else {
            // MongoDB fallback
            const Grade = require("../../models/Academic/Grade.model");
            const grade = await Grade.create({
                student,
                subject,
                classLevel,
                academicYear,
                academicTerm,
                assessmentType,
                examName,
                score,
                maxScore: maxScore || 100,
                remarks,
                teacher,
                schoolId,
                weight,
                isLate,
                latePenalty,
                attemptNumber
            });

            res.status(201).json({
                status: "success",
                data: grade,
            });
        }
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

        // Validate studentId
        if (!studentId || studentId.trim() === '') {
            return res.status(400).json({ 
                status: "fail", 
                message: "Student ID is required" 
            });
        }

        // Try Prisma first, fall back to MongoDB if it fails
        let results;
        let usedPrisma = false;

        try {
            if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
                const { getPrisma } = require('../../../lib/prismaClient');
                const prisma = getPrisma();
                
                if (prisma) {
                    usedPrisma = true;
                    
                    // First verify the student exists
                    const student = await prisma.student.findUnique({
                        where: { id: studentId }
                    });
                    
                    if (!student) {
                        return res.status(404).json({
                            status: "fail",
                            message: "Student not found"
                        });
                    }
                    
                    let where = { studentId: studentId, schoolId: schoolId };
                    if (academicYear) where.academicYear = academicYear;
                    if (academicTerm) where.academicTerm = academicTerm;
                    
                    results = await prisma.result.findMany({
                        where: where,
                        orderBy: { createdAt: 'desc' }
                    });

                    // Calculate overall average
                    const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
                    const average = results.length > 0 ? totalScore / results.length : 0;

                    return res.status(200).json({
                        status: "success",
                        data: {
                            grades: results,
                            average: average.toFixed(2),
                            totalGrades: results.length,
                        },
                    });
                }
            }
        } catch (prismaError) {
            console.warn('Prisma query failed, falling back to MongoDB:', prismaError.message);
            // Fall through to MongoDB fallback
        }

        // MongoDB fallback
        const Grade = require("../../models/Academic/Grade.model");
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
        console.error('Error fetching student grades:', error);
        
        // Return 500 for server errors
        return res.status(500).json({ 
            status: "fail", 
            message: "Failed to fetch student grades"
        });
    }
};

// Get Class Grades (Teacher/Admin)
exports.getClassGrades = async (req, res) => {
    try {
        const { classLevel, subject } = req.query;
        const schoolId = req.schoolId;

        // Use Prisma if enabled
        if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            
            let where = { schoolId: schoolId };
            if (classLevel) where.classLevel = classLevel;
            
            const results = await prisma.result.findMany({
                where: where,
                include: { student: { select: { name: true, studentId: true } } }
            });
            
            await prisma.$disconnect();
            
            return res.status(200).json({
                status: "success",
                data: {
                    grades: results,
                    totalGrades: results.length,
                },
            });
        } else {
            // MongoDB fallback
            const Grade = require("../../models/Academic/Grade.model");
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
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
