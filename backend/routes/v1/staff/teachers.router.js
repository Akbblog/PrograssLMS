const express = require("express");
const teachersRouter = express.Router();
//middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");
const isTeacher = require("../../../middlewares/isTeacher");
const { hasPermission } = require("../../../middlewares/permissions");
const { validateBody } = require("../../../middlewares/validateRequest");
const { teacherCreateSchema, teacherUpdateSchema } = require("../../../validators/user.validators");
//controllers
const {
  createTeacherController,
  teacherLoginController,
  getAllTeachersController,
  getTeacherProfileController,
  updateTeacherProfileController,
  adminUpdateTeacherProfileController,
} = require("../../../controllers/staff/teachers.controller");
// create teacher
// create teacher - requires manageTeachers permission
// create teacher - requires manageTeachers permission
teachersRouter
  .route("/create-teacher")
  .post(
    isLoggedIn,
    isAdmin,
    hasPermission("manageTeachers"),
    validateBody(teacherCreateSchema),
    createTeacherController
  );
// teacher login
teachersRouter.route("/teachers/login").post(teacherLoginController);
//get all teachers
// get all teachers - requires manageTeachers
teachersRouter
  .route("/teachers")
  .get(isLoggedIn, isAdmin, hasPermission("manageTeachers"), getAllTeachersController);

// Admin get all teachers (alternative route for frontend consistency)
teachersRouter
  .route("/admin/teachers")
  .get(isLoggedIn, isAdmin, hasPermission("manageTeachers"), getAllTeachersController);
// get teacher profile
teachersRouter
  .route("/teacher/:teacherId/profile")
  .get(isLoggedIn, isTeacher, getTeacherProfileController);
// teacher update own profile
teachersRouter
  .route("/teacher/update-profile")
  .patch(isLoggedIn, isTeacher, updateTeacherProfileController);

// teacher dashboard
teachersRouter
  .route("/teacher/dashboard")
  .get(isLoggedIn, isTeacher, require("../../../controllers/staff/teachers.controller").getTeacherDashboardController);
// admin update user profile
// admin update teacher profile - requires manageTeachers
// admin update teacher profile - requires manageTeachers
teachersRouter
  .route("/teacher/:teachersId/update-profile")
  .patch(
    isLoggedIn,
    isAdmin,
    hasPermission("manageTeachers"),
    validateBody(teacherUpdateSchema),
    adminUpdateTeacherProfileController
  );

module.exports = teachersRouter;
