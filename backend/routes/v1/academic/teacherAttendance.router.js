const express = require("express");
const teacherAttendanceController = require("../../../controllers/academic/teacherAttendance.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

const teacherAttendanceRouter = express.Router();

// Mark Teacher Attendance (Admin only)
teacherAttendanceRouter.post(
    "/teacher-attendance",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.markTeacherAttendance
);

// Get Teacher Attendance for a specific date (Admin only)
teacherAttendanceRouter.get(
    "/teacher-attendance",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.getTeacherAttendance
);

// Get All Teachers for Attendance Marking (Admin only)
teacherAttendanceRouter.get(
    "/teacher-attendance/teachers",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.getTeachersForAttendance
);

// Get Teacher Attendance History (Admin only)
teacherAttendanceRouter.get(
    "/teacher-attendance/history",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.getTeacherAttendanceHistory
);

// Get Individual Teacher Attendance (Admin only)
teacherAttendanceRouter.get(
    "/teacher-attendance/teacher/:teacherId",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.getIndividualTeacherAttendance
);

// Get Teacher Attendance Summary (Admin only)
teacherAttendanceRouter.get(
    "/teacher-attendance/summary",
    isLoggedIn,
    isAdmin,
    teacherAttendanceController.getTeacherAttendanceSummary
);

module.exports = teacherAttendanceRouter;
