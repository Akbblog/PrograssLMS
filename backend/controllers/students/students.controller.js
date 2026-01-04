const responseStatus = require("../../handlers/responseStatus.handler");
const {
  adminRegisterStudentService,
  studentLoginService,
  getStudentsProfileService,
  getAllStudentsByAdminService,
  getStudentByAdminService,
  studentUpdateProfileService,
  adminUpdateStudentService,
  studentWriteExamService,
  studentSelfRegisterService,
} = require("../../services/students/students.service");

/**
 * @desc Admin Register Student
 * @route POST /api/students/admin/register
 * @access Private Admin only
 **/
exports.adminRegisterStudentController = async (req, res) => {
  try {
    await adminRegisterStudentService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Login student
 * @route POST /api/v1/students/login
 * @access Public
 **/
exports.studentLoginController = async (req, res) => {
  try {
    await studentLoginService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Student Profile
 * @route GET /api/v1/students/profile
 * @access Private Student only
 **/
exports.getStudentProfileController = async (req, res) => {
  try {
    await getStudentsProfileService(req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Students
 * @route GET /api/v1/admin/students
 * @access Private admin only
 **/
exports.getAllStudentsByAdminController = async (req, res) => {
  try {
    // Pass schoolId for multi-tenancy filtering and query params for additional filters
    const filters = {
      currentClassLevel: req.query.currentClassLevel,
      enrollmentStatus: req.query.enrollmentStatus,
    };
    await getAllStudentsByAdminService(req.schoolId, filters, res);
  } catch (error) {
    console.error("Error in getAllStudentsByAdminController:", error);
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get Single Student
 * @route GET /api/v1/students/:studentID/admin
 * @access Private admin only
 **/
exports.getStudentByAdminController = async (req, res) => {
  try {
    await getStudentByAdminService(req.params.studentId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Student updating profile
 * @route UPDATE /api/v1/students/update
 * @access Private Student only
 **/
exports.studentUpdateProfileController = async (req, res) => {
  try {
    await studentUpdateProfileService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin updating Students eg: Assigning classes....
 * @route UPDATE /api/v1/students/:studentID/update/admin
 * @access Private Admin only
 **/
exports.adminUpdateStudentController = async (req, res) => {
  try {
    // adminUpdateStudentService will send response via responseStatus
    await adminUpdateStudentService(req.body, req.params.studentId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

// --- New RESTful Admin Student Controllers ---
exports.createStudentByAdminController = async (req, res) => {
  try {
    // adminRegisterStudentService sends the response itself using responseStatus
    await adminRegisterStudentService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

exports.listStudentsController = async (req, res) => {
  try {
    const filters = {
      currentClassLevel: req.query.currentClassLevel,
      enrollmentStatus: req.query.enrollmentStatus,
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: Math.min(parseInt(req.query.limit) || 25, 100),
    };

    // Delegate to service which will handle sending the response
    await getAllStudentsByAdminService(req.schoolId, filters, res);
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

exports.getStudentByIdController = async (req, res) => {
  try {
    const studentId = req.params.id;
    await getStudentByAdminService(studentId, res);
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

exports.updateStudentByIdController = async (req, res) => {
  try {
    const studentId = req.params.id;
    // adminUpdateStudentService will send response via responseStatus
    await adminUpdateStudentService(req.body, studentId, res);
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

exports.deleteStudentByIdController = async (req, res) => {
  try {
    const studentId = req.params.id;
    const Student = require('../../models/Students/students.model');
    const schoolId = req.schoolId;
    const deleted = await Student.findOneAndDelete({ _id: studentId, schoolId });
    if (!deleted) return responseStatus(res, 404, 'failed', 'Student not found or already deleted');
    responseStatus(res, 200, 'success', deleted, 'Student deleted');
  } catch (error) {
    responseStatus(res, 400, 'failed', error.message);
  }
};

/**
 * @desc Students taking exams
 * @route POST /api/v1/students/:examId/exam-write
 * @access Private Students only
 **/
exports.studentWriteExamController = async (req, res) => {
  try {
    await studentWriteExamService(
      req.body,
      req.userAuth.id,
      req.params.examId,
      res
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Student Self Register
 * @route POST /api/v1/students/register
 * @access Public
 **/
exports.studentSelfRegisterController = async (req, res) => {
  try {
    await studentSelfRegisterService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get Student Dashboard
 * @route GET /api/v1/students/dashboard
 * @access Private (student)
 */
exports.getStudentDashboardController = async (req, res) => {
    try {
        const result = await exports.getStudentDashboardServiceWrapper(req.userAuth.id, req.schoolId);
        if (result.error) return responseStatus(res, 404, "failed", result.error);
        responseStatus(res, 200, "success", result.data);
    } catch (error) {
        responseStatus(res, 500, "failed", error.message);
    }
};

// internal wrapper to call service method
exports.getStudentDashboardServiceWrapper = async (studentId, schoolId) => {
    const studentsService = require("../../services/students/students.service");
    return studentsService.getStudentDashboardService(studentId, schoolId);
};
