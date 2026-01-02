const express = require("express");
const router = express.Router();
const financeController = require("../../../controllers/finance/finance.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");

router.use(isLoggedIn);

// Admin & Accountant routes
router.post(
    "/generate-student-fee",
    isAdminOrTeacher,
    financeController.generateStudentFee
);

router.get(
    "/report",
    isAdminOrTeacher,
    financeController.getFinancialReport
);

router.get(
    "/reminders",
    isAdminOrTeacher,
    financeController.getPaymentReminders
);

module.exports = router;
