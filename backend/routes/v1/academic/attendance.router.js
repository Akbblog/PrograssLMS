const express = require("express");
const attendanceController = require("../../../controllers/academic/attendance.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

const attendanceRouter = express.Router();

// Mark Attendance (Teacher or Admin)
attendanceRouter.post("/attendance", isLoggedIn, attendanceController.markAttendance);

// Get Attendance for Class (Teacher or Admin)
attendanceRouter.get("/attendance", isLoggedIn, attendanceController.getAttendance);

// Get Students for Attendance Marking
attendanceRouter.get("/attendance/students/:classLevel", isLoggedIn, attendanceController.getStudentsForAttendance);

// Get Attendance History for Class
attendanceRouter.get("/attendance/history/:classLevel", isLoggedIn, attendanceController.getAttendanceHistory);

// Get Attendance Summary for Class
attendanceRouter.get("/attendance/summary/:classLevel", isLoggedIn, attendanceController.getAttendanceSummary);

// Get Student Attendance (Student, Parent, Admin, Teacher)
attendanceRouter.get("/attendance/student/:studentId", isLoggedIn, attendanceController.getStudentAttendance);

module.exports = attendanceRouter;

