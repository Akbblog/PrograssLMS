const express = require("express");
const router = express.Router();
const {
    getStudentPerformance,
    getClassPerformance
} = require("../../../controllers/academic/performance.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// Students can see their own performance, teachers/admins can see all
router.get("/performance/student/:studentId", isLoggedIn, getStudentPerformance);
router.get("/performance/class/:classLevelId", isLoggedIn, getClassPerformance);

module.exports = router;
