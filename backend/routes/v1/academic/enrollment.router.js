const express = require("express");
const enrollmentController = require("../../../controllers/academic/enrollment.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

const enrollmentRouter = express.Router();

// Create Enrollment (Admin)
enrollmentRouter.post("/enrollments", isLoggedIn, isAdmin, enrollmentController.createEnrollment);

// Get Student Enrollments
enrollmentRouter.get("/enrollments/student/:studentId", isLoggedIn, enrollmentController.getStudentEnrollments);

// Update Enrollment Progress
enrollmentRouter.patch("/enrollments/:enrollmentId/progress", isLoggedIn, enrollmentController.updateEnrollmentProgress);

module.exports = enrollmentRouter;
