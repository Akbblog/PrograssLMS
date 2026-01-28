const express = require("express");
const teachersRouter = express.Router();
console.log('[TeachersRouter] File loaded and router created');
//middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");
const isTeacher = require("../../../middlewares/isTeacher");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");
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
  deleteTeacherController,
} = require("../../../controllers/staff/teachers.controller");

const { uploadSingle } = require('../../../middlewares/fileUpload');
const { uploadTeacherAvatarController } = require('../../../controllers/staff/teachers.controller');
// RESTful Teacher routes
teachersRouter
  .route('/teachers')
  .get(isLoggedIn, isAdmin, hasPermission('manageTeachers'), getAllTeachersController)
  .post(isLoggedIn, isAdmin, hasPermission('manageTeachers'), validateBody(teacherCreateSchema), createTeacherController);

teachersRouter
  .route('/teachers/:id')
  .get(isLoggedIn, isAdminOrTeacher, getTeacherProfileController)
  .patch(isLoggedIn, isAdmin, hasPermission('manageTeachers'), validateBody(teacherUpdateSchema), adminUpdateTeacherProfileController)
  .delete(isLoggedIn, isAdmin, hasPermission('manageTeachers'), deleteTeacherController);

// Upload teacher avatar
teachersRouter
  .route('/teachers/:id/avatar')
  .patch(isLoggedIn, (req, res, next) => {
    if (req.userRole === 'teacher' && req.userAuth && req.userAuth.id !== req.params.id) {
      const responseStatus = require('../../../handlers/responseStatus.handler');
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }
    next();
  }, uploadSingle('avatar'), uploadTeacherAvatarController);

// Staff card generation (PDF)
teachersRouter
  .route('/teachers/:id/card')
  .get(isLoggedIn, (req, res, next) => {
    if (req.userRole === 'teacher' && req.userAuth && req.userAuth.id !== req.params.id) {
      const responseStatus = require('../../../handlers/responseStatus.handler');
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }
    next();
  }, require('../../../controllers/staff/teachers.controller').generateTeacherCardController);

// Legacy and utility routes
teachersRouter.route('/teachers/login').post(teacherLoginController);
teachersRouter
  .route('/admin/teachers')
  .get(isLoggedIn, isAdmin, hasPermission('manageTeachers'), getAllTeachersController);

teachersRouter
  .route('/teacher/dashboard')
  .get((req, res, next) => {
    console.log('[Teachers Router] Caught /teacher/dashboard GET request');
    next();
  }, isLoggedIn, isTeacher, require('../../../controllers/staff/teachers.controller').getTeacherDashboardController);

teachersRouter
  .route('/teacher/update-profile')
  .patch((req, res, next) => {
    console.log('[Teachers Router] Caught /teacher/update-profile PATCH request');
    next();
  }, isLoggedIn, isTeacher, updateTeacherProfileController);

module.exports = teachersRouter;
