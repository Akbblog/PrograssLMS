const express = require("express");
const assignmentController = require("../../../controllers/academic/assignment.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const { requireFinancialClearance } = require("../../../middlewares/financialGatekeeper");

const assignmentRouter = express.Router();

// Create Assignment (Teacher/Admin)
assignmentRouter.post("/assignments", isLoggedIn, assignmentController.createAssignment);

// Get Assignments
assignmentRouter.get("/assignments", isLoggedIn, requireFinancialClearance("courses"), assignmentController.getAssignments);

// Submit Assignment (Student)
assignmentRouter.post("/assignments/:assignmentId/submit", isLoggedIn, requireFinancialClearance("courses"), assignmentController.submitAssignment);

// Grade Submission (Teacher/Admin)
assignmentRouter.post("/assignments/:assignmentId/grade/:studentId", isLoggedIn, assignmentController.gradeSubmission);

module.exports = assignmentRouter;
