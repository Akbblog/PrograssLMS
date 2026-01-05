const express = require("express");
const router = express.Router();
const attendanceBehaviorController = require("../../../controllers/academic/attendanceBehavior.controller.js");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");

router.use(isLoggedIn);

router.get(
    "/student-profile/:studentId",
    isAdminOrTeacher,
    attendanceBehaviorController.getStudentProfile
);

router.get(
    "/alerts",
    isAdminOrTeacher,
    attendanceBehaviorController.getBehaviorAlerts
);

router.get(
    "/class-analytics/:classLevelId",
    isAdminOrTeacher,
    attendanceBehaviorController.getClassAnalytics
);

module.exports = router;
