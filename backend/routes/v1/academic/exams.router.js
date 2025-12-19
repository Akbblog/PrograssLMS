const express = require("express");
const examRouter = express.Router();
// middlewares
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");

const {
  getAllExamController,
  createExamController,
  getExamByIdController,
  updateExamController,
} = require("../../../controllers/academic/exams.controller");

// teacher create exam
examRouter
  .route("/exams")
  .get(isLoggedIn, isAdminOrTeacher, getAllExamController)
  .post(isLoggedIn, isAdminOrTeacher, createExamController);
examRouter
  .route("/exams/:examId")
  .get(isLoggedIn, isAdminOrTeacher, getExamByIdController)
  .patch(isLoggedIn, isAdminOrTeacher, updateExamController);

module.exports = examRouter;
