const express = require("express");
const router = express.Router();
const {
    getStudentPerformance,
    getClassPerformance
} = require("../../../controllers/academic/performance.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");

router.use(isLoggedIn);

// Students can see their own performance, teachers/admins can see all
router.get("/performance/student/:studentId", getStudentPerformance);
router.get("/performance/class/:classLevelId", getClassPerformance);

module.exports = router;
