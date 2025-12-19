const express = require("express");
const classRouter = express.Router();
// middleware
const isAdmin = require("../../../middlewares/isAdmin");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
// controllers
const {
  getClassLevelsController,
  createClassLevelController,
  getClassLevelController,
  updateClassLevelController,
  deleteClassLevelController,
  getSubjectsByClassController,
  getTeachersByClassController,
  assignSubjectToClassController,
  removeSubjectFromClassController,
} = require("../../../controllers/academic/class.controller");

classRouter
  .route("/class-levels")
  .get(isLoggedIn, isAdminOrTeacher, getClassLevelsController)
  .post(isLoggedIn, isAdmin, createClassLevelController);

classRouter
  .route("/class-levels/:id")
  .get(isLoggedIn, isAdminOrTeacher, getClassLevelController)
  .patch(isLoggedIn, isAdmin, updateClassLevelController)
  .delete(isLoggedIn, isAdmin, deleteClassLevelController);

// Routes for subjects by class
classRouter
  .route("/admin/subjects-by-class/:classId")
  .get(isLoggedIn, isAdminOrTeacher, getSubjectsByClassController);

classRouter
  .route("/admin/teachers-by-class/:classId")
  .get(isLoggedIn, isAdmin, getTeachersByClassController);

// Routes for assigning/removing subjects from classes
classRouter
  .route("/class-levels/:classId/subjects/:subjectId")
  .post(isLoggedIn, isAdmin, assignSubjectToClassController)
  .delete(isLoggedIn, isAdmin, removeSubjectFromClassController);

module.exports = classRouter;
