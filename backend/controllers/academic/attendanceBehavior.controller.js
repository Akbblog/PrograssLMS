const AttendanceBehaviorService = require("../../services/academic/attendanceBehavior.service");

const getSchoolId = (req) => req.schoolId;

exports.getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { academicYearId } = req.query;
        const service = new AttendanceBehaviorService(getSchoolId(req));

        const profile = await service.getStudentBehaviorProfile(studentId, academicYearId);

        res.status(200).json({
            status: "success",
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

exports.getBehaviorAlerts = async (req, res) => {
    try {
        const { academicYearId } = req.query;
        const service = new AttendanceBehaviorService(getSchoolId(req));

        const alerts = await service.generateBehaviorAlerts(academicYearId);

        res.status(200).json({
            status: "success",
            data: alerts
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

exports.getClassAnalytics = async (req, res) => {
    try {
        const { classLevelId } = req.params;
        const { academicYearId } = req.query;
        const service = new AttendanceBehaviorService(getSchoolId(req));

        const analytics = await service.getClassBehaviorAnalytics(classLevelId, academicYearId);

        res.status(200).json({
            status: "success",
            data: analytics
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};
