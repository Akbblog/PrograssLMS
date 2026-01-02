const PerformanceService = require("../../services/academic/performance.service");

// Get Student Performance
exports.getStudentPerformance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { academicYear, academicTerm } = req.query;
        const schoolId = req.schoolId;

        const performanceService = new PerformanceService(schoolId);
        const performance = await performanceService.calculateStudentPerformance(
            studentId,
            academicYear,
            academicTerm
        );

        res.status(200).json({ status: "success", data: performance });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Class Performance
exports.getClassPerformance = async (req, res) => {
    try {
        const { classLevelId } = req.params;
        const { subject, academicTerm } = req.query;
        const schoolId = req.schoolId;

        const performanceService = new PerformanceService(schoolId);
        const performance = await performanceService.calculateClassPerformance(
            classLevelId,
            subject,
            academicTerm
        );

        res.status(200).json({ status: "success", data: performance });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
