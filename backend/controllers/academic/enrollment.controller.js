const Enrollment = require("../../models/Academic/Enrollment.model");

// Create Enrollment
exports.createEnrollment = async (req, res) => {
    try {
        const { student, subject, classLevel, academicYear, academicTerm } = req.body;
        const schoolId = req.userAuth.schoolId;

        const enrollment = await Enrollment.create({
            student,
            subject,
            classLevel,
            academicYear,
            academicTerm,
            schoolId,
        });

        res.status(201).json({
            status: "success",
            data: enrollment,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Student Enrollments
exports.getStudentEnrollments = async (req, res) => {
    try {
        const { studentId } = req.params;
        const schoolId = req.userAuth.schoolId;

        const enrollments = await Enrollment.find({ student: studentId, schoolId, status: "active" })
            .populate("subject", "name description")
            .populate("classLevel", "name")
            .populate("academicYear", "name")
            .populate("academicTerm", "name");

        res.status(200).json({
            status: "success",
            data: enrollments,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Update Enrollment Progress
exports.updateEnrollmentProgress = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { progress } = req.body;

        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { progress },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: enrollment,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
