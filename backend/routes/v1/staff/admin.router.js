const express = require("express");
const {
  registerAdminController,
  loginAdminController,
  getAdminsController,
  updateAdminController,
  deleteAdminController,
  adminSuspendTeacherController,
  adminUnSuspendTeacherController,
  adminWithdrawTeacherController,
  adminUnWithdrawTeacherController,
  adminUnPublishResultsController,
  getAdminProfileController,
  getDashboardStatsController,
  adminDeleteTeacherController,
} = require("../../../controllers/staff/admin.controller");
const adminRouter = express.Router();
// middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdmin = require("../../../middlewares/isAdmin");
const { hasPermission } = require("../../../middlewares/permissions");
const { validateBody } = require("../../../middlewares/validateRequest");
const {
  adminCreateSchema,
  adminUpdateSchema,
} = require("../../../validators/user.validators");

// register - requires manageUsers permission
adminRouter
  .route("/admin/register")
  .post(
    isLoggedIn,
    isAdmin,
    hasPermission("manageUsers"),
    validateBody(adminCreateSchema),
    registerAdminController
  );
//  login
adminRouter.route("/admin/login").post(loginAdminController);
// get all admin - requires manageUsers
adminRouter.route("/admins").get(isLoggedIn, isAdmin, hasPermission("manageUsers"), getAdminsController);
//get current admin profile
adminRouter.route("/admin/profile").get(isLoggedIn, getAdminProfileController);
// get dashboard stats
adminRouter.route("/admin/stats").get(isLoggedIn, isAdmin, getDashboardStatsController);

// Export CSV endpoints for students/teachers
adminRouter.route('/admin/export/students').get(isLoggedIn, isAdmin, hasPermission('manageStudents'), require('../../../controllers/staff/admin.controller').exportStudentsController);
adminRouter.route('/admin/export/teachers').get(isLoggedIn, isAdmin, hasPermission('manageTeachers'), require('../../../controllers/staff/admin.controller').exportTeachersController);
// update/delete admin - update requires manageUsers
adminRouter
  .route("/admin/:id")
  .put(
    isLoggedIn,
    isAdmin,
    hasPermission("manageUsers"),
    validateBody(adminUpdateSchema),
    updateAdminController
  )
  .delete(isLoggedIn, isAdmin, hasPermission("manageUsers"), deleteAdminController);
// admin suspend a teacher - requires manageTeachers
adminRouter
  .route("/admins/suspend/teacher/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminSuspendTeacherController);
// admin unsuspend a teacher
adminRouter
  .route("/admins/unsuspend/teacher/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminUnSuspendTeacherController);
//  admin withdraws a teacher
adminRouter
  .route("/admins/withdraw/teacher/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminWithdrawTeacherController);
// admin un-withdraws a teacher
adminRouter
  .route("/admins/unwithdraw/teacher/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminUnWithdrawTeacherController);
// admin permanently deletes a teacher
adminRouter
  .route("/admins/teacher/:id")
  .delete(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminDeleteTeacherController);
// admin publish result - requires manageTeachers
adminRouter
  .route("/admins/publish/result/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminUnPublishResultsController);
// admin un-publish result
adminRouter
  .route("/admins/unpublish/result/:id")
  .put(isLoggedIn, isAdmin, hasPermission("manageTeachers"), adminUnPublishResultsController);

module.exports = adminRouter;
