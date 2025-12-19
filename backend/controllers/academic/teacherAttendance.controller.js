const responseStatus = require("../../handlers/responseStatus.handler");
const Admin = require("../../models/Staff/admin.model");
const {
    markTeacherAttendanceService,
    getTeacherAttendanceService,
    getTeachersForAttendanceService,
    getTeacherAttendanceHistoryService,
    getIndividualTeacherAttendanceService,
    getTeacherAttendanceSummaryService,
} = require("../../services/academic/teacherAttendance.service");

/**
 * @desc Mark Teacher Attendance
 * @route POST /api/v1/teacher-attendance
 * @access Private (Admin only)
 */
exports.markTeacherAttendance = async (req, res) => {
    try {
        await markTeacherAttendanceService(req.body, req.userAuth.id, res);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

/**
 * @desc Get Teacher Attendance for a specific date
 * @route GET /api/v1/teacher-attendance?date=YYYY-MM-DD
 * @access Private (Admin only)
 */
exports.getTeacherAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return responseStatus(res, 400, "failed", "Date is required");
        }

        const admin = await Admin.findById(req.userAuth.id);
        if (!admin || !admin.schoolId) {
            return responseStatus(res, 401, "failed", "Unauthorized");
        }

        const attendance = await getTeacherAttendanceService(date, admin.schoolId);
        responseStatus(res, 200, "success", attendance);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

/**
 * @desc Get All Teachers for Attendance Marking
 * @route GET /api/v1/teacher-attendance/teachers
 * @access Private (Admin only)
 */
exports.getTeachersForAttendance = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userAuth.id);
        if (!admin || !admin.schoolId) {
            return responseStatus(res, 401, "failed", "Unauthorized");
        }

        const teachers = await getTeachersForAttendanceService(admin.schoolId);
        responseStatus(res, 200, "success", teachers);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

/**
 * @desc Get Teacher Attendance History
 * @route GET /api/v1/teacher-attendance/history?startDate=...&endDate=...
 * @access Private (Admin only)
 */
exports.getTeacherAttendanceHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const admin = await Admin.findById(req.userAuth.id);
        if (!admin || !admin.schoolId) {
            return responseStatus(res, 401, "failed", "Unauthorized");
        }

        const history = await getTeacherAttendanceHistoryService(
            startDate,
            endDate,
            admin.schoolId
        );
        responseStatus(res, 200, "success", history);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

/**
 * @desc Get Individual Teacher Attendance
 * @route GET /api/v1/teacher-attendance/teacher/:teacherId
 * @access Private (Admin only)
 */
exports.getIndividualTeacherAttendance = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { startDate, endDate } = req.query;

        const admin = await Admin.findById(req.userAuth.id);
        if (!admin || !admin.schoolId) {
            return responseStatus(res, 401, "failed", "Unauthorized");
        }

        const attendance = await getIndividualTeacherAttendanceService(
            teacherId,
            startDate,
            endDate,
            admin.schoolId
        );
        responseStatus(res, 200, "success", attendance);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

/**
 * @desc Get Teacher Attendance Summary
 * @route GET /api/v1/teacher-attendance/summary
 * @access Private (Admin only)
 */
exports.getTeacherAttendanceSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const admin = await Admin.findById(req.userAuth.id);
        if (!admin || !admin.schoolId) {
            return responseStatus(res, 401, "failed", "Unauthorized");
        }

        const summary = await getTeacherAttendanceSummaryService(
            startDate,
            endDate,
            admin.schoolId
        );
        responseStatus(res, 200, "success", summary);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};
