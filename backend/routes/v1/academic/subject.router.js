const express = require("express");
const subjectRouter = express.Router();
// middlewares
const isAdmin = require("../../../middlewares/isAdmin");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
// controllers
const {
  getSubjectsController,
  getSubjectController,
  updateSubjectController,
  deleteSubjectController,
  createSubjectController,
  createSimpleSubjectController,
} = require("../../../controllers/academic/subject.controller");

// Simple subject creation (without program requirement)
subjectRouter.route("/subjects").post(isLoggedIn, isAdmin, createSimpleSubjectController);

subjectRouter.route("/subject").get(isLoggedIn, isAdminOrTeacher, getSubjectsController);
subjectRouter
  .route("/subject/:id")
  .get(isLoggedIn, isAdminOrTeacher, getSubjectController)
  .patch(isLoggedIn, isAdmin, updateSubjectController)
  .delete(isLoggedIn, isAdmin, deleteSubjectController);
subjectRouter
  .route("/create-subject/:programId")
  .post(isLoggedIn, isAdmin, createSubjectController);

module.exports = subjectRouter;

