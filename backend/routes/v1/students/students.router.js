const express = require("express");
const studentsRouter = express.Router();

// Middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");
const isStudent = require("../../../middlewares/isStudent");
const { hasPermission } = require("../../../middlewares/permissions");
const { validateBody } = require("../../../middlewares/validateRequest");
const {
  studentSelfRegisterSchema,
  studentAdminCreateSchema,
  studentUpdateSchema,
} = require("../../../validators/user.validators");

// Controllers
const {
  adminRegisterStudentController,
  studentLoginController,
  getStudentProfileController,
  getAllStudentsByAdminController,
  getStudentByAdminController,
  studentUpdateProfileController,
  adminUpdateStudentController,
  studentWriteExamController,
  studentSelfRegisterController,
} = require("../../../controllers/students/students.controller");

// Student self-registration (public - no auth required)
studentsRouter
  .route("/students/register")
  .post(validateBody(studentSelfRegisterSchema), studentSelfRegisterController);

// Create Student by Admin
studentsRouter
  .route("/students/admin/register")
  .post(isLoggedIn, isAdmin, adminRegisterStudentController);
// Create Student by Admin - requires manageStudents
// Create Student by Admin - requires manageStudents
studentsRouter
  .route("/students/admin/register")
  .post(
    isLoggedIn,
    isAdmin,
    hasPermission("manageStudents"),
    validateBody(studentAdminCreateSchema),
    adminRegisterStudentController
  );

// Student Login
studentsRouter.route("/students/login").post(studentLoginController);

// Get Student Profile
studentsRouter
  .route("/students/profile")
  .get(isLoggedIn, isStudent, getStudentProfileController);

// Get All Students by Admin - requires manageStudents
studentsRouter
  .route("/admin/students")
  .get(
    isLoggedIn,
    isAdminOrTeacher,
    (req, res, next) => {
      if (req.userRole === "admin") {
        return hasPermission("manageStudents")(req, res, next);
      }
      next();
    },
    getAllStudentsByAdminController
  );

// Get Single Student by Admin
studentsRouter
  .route("/:studentId/admin")
  .get(isLoggedIn, isAdmin, getStudentByAdminController);
// Get Single Student by Admin - requires manageStudents
studentsRouter
  .route("/:studentId/admin")
  .get(isLoggedIn, isAdmin, hasPermission("manageStudents"), getStudentByAdminController);

// Update Student Profile by Student
studentsRouter
  .route("/update")
  .patch(isLoggedIn, isStudent, studentUpdateProfileController);

// Admin Update Student Profile
studentsRouter
  .route("/:studentId/update/admin")
  .patch(isLoggedIn, isAdmin, adminUpdateStudentController);
// Admin Update Student Profile - requires manageStudents
// Admin Update Student Profile - requires manageStudents
studentsRouter
  .route("/:studentId/update/admin")
  .patch(
    isLoggedIn,
    isAdmin,
    hasPermission("manageStudents"),
    validateBody(studentUpdateSchema),
    adminUpdateStudentController
  );

// student write exam
studentsRouter
  .route("/students/:examId/exam-write")
  .post(isLoggedIn, isStudent, studentWriteExamController);

module.exports = studentsRouter;
