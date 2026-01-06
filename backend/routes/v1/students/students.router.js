const express = require("express");
const studentsRouter = express.Router();

// Debugging middleware: log login requests and Authorization header
studentsRouter.use((req, res, next) => {
  try {
    if (req.path && req.path.toLowerCase().includes('login')) {
      console.log(`[DEBUG] Students Router - ${req.method} ${req.path} - Authorization:`, req.headers.authorization || req.headers.Authorization);
    }
  } catch (err) {
    console.error('[DEBUG] Students Router logging error:', err.message);
  }
  next();
});

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
  // New RESTful handlers
  createStudentByAdminController,
  listStudentsController,
  getStudentByIdController,
  updateStudentByIdController,
  deleteStudentByIdController,
  generateStudentCardController,
  uploadStudentAvatarController,
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

// Student Dashboard
studentsRouter
  .route("/students/dashboard")
  .get(isLoggedIn, isStudent, require("../../../controllers/students/students.controller").getStudentDashboardController);

// New RESTful Student routes
studentsRouter
  .route('/students')
  .get(isLoggedIn, isAdminOrTeacher, (req, res, next) => {
    if (req.userRole === 'admin') return hasPermission('manageStudents')(req, res, next);
    next();
  }, listStudentsController)
  .post(isLoggedIn, isAdmin, hasPermission('manageStudents'), validateBody(studentAdminCreateSchema), createStudentByAdminController);

studentsRouter
  .route('/students/:id')
  .get(isLoggedIn, isAdmin, getStudentByIdController)
  .patch(isLoggedIn, isAdmin, hasPermission('manageStudents'), validateBody(studentUpdateSchema), updateStudentByIdController)
  .delete(isLoggedIn, isAdmin, hasPermission('manageStudents'), deleteStudentByIdController);

// Student card generation (PDF)
studentsRouter
  .route('/students/:id/card')
  .get(isLoggedIn, (req, res, next) => {
    // allow admin/teacher through default middlewares, otherwise check student ownership
    if (req.userRole === 'student' && req.userAuth && req.userAuth.id !== req.params.id) {
      const responseStatus = require('../../../handlers/responseStatus.handler');
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }
    next();
  }, generateStudentCardController);

// Backwards compatible routes (deprecated but still available)
// Get All Students by Admin - legacy
studentsRouter
  .route('/admin/students')
  .get(
    isLoggedIn,
    isAdminOrTeacher,
    (req, res, next) => {
      if (req.userRole === 'admin') {
        return hasPermission('manageStudents')(req, res, next);
      }
      next();
    },
    getAllStudentsByAdminController
  );

// Legacy single student admin route
studentsRouter
  .route('/:studentId/admin')
  .get(isLoggedIn, isAdmin, hasPermission('manageStudents'), getStudentByAdminController);

// Student profile/update routes
studentsRouter
  .route('/students/profile')
  .get(isLoggedIn, isStudent, getStudentProfileController);

studentsRouter
  .route('/students/register')
  .post(validateBody(studentSelfRegisterSchema), studentSelfRegisterController);

studentsRouter
  .route('/students/login')
  .post(studentLoginController);

// Student Dashboard
studentsRouter
  .route('/students/dashboard')
  .get(isLoggedIn, isStudent, require('../../../controllers/students/students.controller').getStudentDashboardController);

// student write exam
studentsRouter
  .route('/students/:examId/exam-write')
  .post(isLoggedIn, isStudent, studentWriteExamController);

// Upload student avatar (single file) and generate QR
const { uploadSingle, processAttachments } = require('../../../middlewares/fileUpload');
studentsRouter
  .route('/students/:id/avatar')
  .patch(isLoggedIn, (req, res, next) => {
    // Allow student updating own avatar or admin
    if (req.userRole === 'student' && req.userAuth && req.userAuth.id !== req.params.id) {
      const responseStatus = require('../../../handlers/responseStatus.handler');
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }
    next();
  }, uploadSingle('avatar'), async (req, res, next) => {
    // delegate to controller which will call processAttachments internally
    return uploadStudentAvatarController(req, res, next);
  });

module.exports = studentsRouter;
