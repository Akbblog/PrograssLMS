const express = require("express");
const resultsRouter = express.Router();
// middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isStudent = require("../../../middlewares/isStudent");
const isTeacher = require("../../../middlewares/isTeacher");
const { requireFinancialClearance } = require("../../../middlewares/financialGatekeeper");
// controllers
const {
  studentCheckExamResultController,
  getAllExamResultsController,
} = require("../../../controllers/academic/results.controller");
// student check exam result
resultsRouter
  .route("/exam-result/:examId/check")
  .post(isLoggedIn, isStudent, requireFinancialClearance("grades"), studentCheckExamResultController);
//   Teacher get all exam result
resultsRouter
  .route("/exam-results/:classLevelId")
  .get(isLoggedIn, isTeacher, getAllExamResultsController);

module.exports = resultsRouter;
