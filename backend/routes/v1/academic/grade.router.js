const express = require("express");
const gradeController = require("../../../controllers/academic/grade.controller");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");

const gradeRouter = express.Router();

// Create Grade (Teacher/Admin)
gradeRouter.post("/grades", isLoggedIn, gradeController.createGrade);

// Get Student Grades
gradeRouter.get("/grades/student/:studentId", isLoggedIn, gradeController.getStudentGrades);

// Get Class Grades (Teacher/Admin)
gradeRouter.get("/grades/class", isLoggedIn, gradeController.getClassGrades);

module.exports = gradeRouter;
