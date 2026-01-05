const responseStatus = require("../../handlers/responseStatus.handler.js");
const {
  createTeacherService,
  teacherLoginService,
  getAllTeachersService,
  getTeacherProfileService,
  updateTeacherProfileService,
  adminUpdateTeacherProfileService,
} = require("../../services/staff/teachers.service");

/**
 * @desc Admin create teacher
 * @route POST /api/v1/create-teacher
 * @access Private (admin)
 **/
exports.createTeacherController = async (req, res) => {
  try {
    await createTeacherService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Teacher login
 * @route POST /api/v1/teacher/login
 * @access Public
 **/
exports.teacherLoginController = async (req, res) => {
  try {
    await teacherLoginService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all teachers
 * @route GET /api/v1/teachers
 * @access Private (admin)
 **/
exports.getAllTeachersController = async (req, res) => {
  try {
    // Pass schoolId for multi-tenancy filtering
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);
    const result = await getAllTeachersService(req.schoolId, { page, limit });
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

exports.getTeacherByIdController = async (req, res) => {
  try {
    const id = req.params.id || req.params.teacherId;
    const result = await getTeacherProfileService(id);
    if (!result) return responseStatus(res, 404, 'failed', 'Teacher not found');
    responseStatus(res, 200, 'success', result);
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

exports.deleteTeacherController = async (req, res) => {
  try {
    const id = req.params.id;
    const Teacher = require('../../models/Staff/teachers.model');
    const deleted = await Teacher.findOneAndDelete({ _id: id, schoolId: req.schoolId });
    if (!deleted) return responseStatus(res, 404, 'failed', 'Teacher not found');
    responseStatus(res, 200, 'success', deleted, 'Teacher deleted');
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};



/**
 * @desc Get teacher profile
 * @route GET /api/v1/teacher/profile
 * @access Private (teacher)
 **/
exports.getTeacherProfileController = async (req, res) => {
  try {
    const id = req.params.teacherId || req.userAuth?.id;
    const result = await getTeacherProfileService(id);
    if (!result) return responseStatus(res, 404, 'failed', 'Teacher not found');
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update teacher profile
 * @route PATCH /api/v1/teacher/update-profile
 * @access Private (Teacher)
 **/
exports.updateTeacherProfileController = async (req, res) => {
  try {
    const result = await updateTeacherProfileService(
      req.body,
      req.userAuth.id,
      res
    );
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin update teacher profile
 * @route PATCH /api/v1/teacher/:teachersId/update-profile
 * @access Private (Admin)
 **/
exports.adminUpdateTeacherProfileController = async (req, res) => {
  try {
    const result = await adminUpdateTeacherProfileService(
      req.body,
      req.params.teachersId
    );
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get Teacher Dashboard
 * @route GET /api/v1/teacher/dashboard
 * @access Private (teacher)
 */
exports.getTeacherDashboardController = async (req, res) => {
  try {
    const teacherId = req.userAuth.id;
    const schoolId = req.schoolId;
    const { getTeacherDashboardService } = require("../../services/staff/teachers.service");
    const result = await getTeacherDashboardService(teacherId, schoolId);
    if (result.error) return responseStatus(res, 404, "failed", result.error);
    responseStatus(res, 200, "success", result.data);
  } catch (error) {
    responseStatus(res, 500, "failed", error.message);
  }
};
