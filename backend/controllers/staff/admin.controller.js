const responseStatus = require("../../handlers/responseStatus.handler.js");
const {
  registerAdminService,
  getAdminsService,
  loginAdminService,
  getSingleProfileService,
  updateAdminService,
} = require("../../services/staff/admin.service");

/**
 * @desc Register Admin
 * @route POST /api/v1/admin/register
 * @access Private(admin)
 **/
exports.registerAdminController = async (req, res) => {
  try {
    await registerAdminService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Login Admin
 * @route POST /api/v1/admin/login
 * @access Private
 **/
exports.loginAdminController = async (req, res) => {
  try {
    await loginAdminService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all admins
 * @route GET /api/v1/admins
 * @access Private
 **/
exports.getAdminsController = async (req, res) => {
  try {
    const result = await getAdminsService();
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get current admin
 * @route GET /api/v1/admin/profile
 * @access Private
 **/
exports.getAdminProfileController = async (req, res) => {
  try {
    await getSingleProfileService(req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update admin
 * @route PUT /api/v1/admin/:id
 * @access Private
 **/
exports.updateAdminController = async (req, res) => {
  try {
    await updateAdminService(req.userAuth.id, req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete admin
 * @route DELETE /api/v1/admins/:id
 * @access Private
 **/
exports.deleteAdminController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "delete admin",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin suspends a teacher
 * @route PUT /api/v1/admins/suspend/teacher/:id
 * @access Private
 **/
exports.adminSuspendTeacherController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin unsuspends a teacher
 * @route PUT /api/v1/admins/unsuspend/teacher/:id
 * @access Private
 **/
exports.adminUnSuspendTeacherController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unsuspend teacher",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin withdraws a teacher (soft delete)
 * @route PUT /api/v1/admins/withdraw/teacher/:id
 * @access Private
 **/
exports.adminWithdrawTeacherController = async (req, res) => {
  try {
    const Teacher = require("../../models/Staff/teachers.model");
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isWithdrawn: true },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return responseStatus(res, 404, "failed", "Teacher not found");
    }

    res.status(200).json({
      status: "success",
      message: "Teacher withdrawn successfully",
      data: teacher,
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin un-withdraws a teacher
 * @route PUT /api/v1/admins/unwithdraw/teacher/:id
 * @access Private
 **/
exports.adminUnWithdrawTeacherController = async (req, res) => {
  try {
    const Teacher = require("../../models/Staff/teachers.model");
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isWithdrawn: false },
      { new: true }
    ).select('-password');

    if (!teacher) {
      return responseStatus(res, 404, "failed", "Teacher not found");
    }

    res.status(200).json({
      status: "success",
      message: "Teacher restored successfully",
      data: teacher,
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin permanently deletes a teacher
 * @route DELETE /api/v1/admins/teacher/:id
 * @access Private
 **/
exports.adminDeleteTeacherController = async (req, res) => {
  try {
    const Teacher = require("../../models/Staff/teachers.model");
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return responseStatus(res, 404, "failed", "Teacher not found");
    }

    res.status(200).json({
      status: "success",
      message: "Teacher deleted permanently",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin publishes exam result
 * @route PUT /api/v1/admins/publish/result/:id
 * @access Private
 **/
exports.adminPublishResultsController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publish exam",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin un-publishes exam result
 * @route PUT /api/v1/admins/unpublish/result/:id
 * @access Private
 **/
exports.adminUnPublishResultsController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublish exam",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
/**
 * @desc Get admin dashboard stats
 * @route GET /api/v1/admin/stats
 * @access Private
 **/
exports.getDashboardStatsController = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const Student = require("../../models/Students/students.model");
    const Teacher = require("../../models/Staff/teachers.model");
    const ClassLevel = require("../../models/Academic/class.model");

    // Filter by schoolId for multi-tenancy
    const schoolId = req.schoolId;
    const filter = schoolId ? { schoolId } : {};

    const totalStudents = await Student.countDocuments(filter);
    const totalTeachers = await Teacher.countDocuments(filter);
    const totalClasses = await ClassLevel.countDocuments(filter);

    // Calculate total revenue from payments (filtered by school)
    let totalRevenue = 0;
    try {
      const FeePayment = require("../../models/Finance/FeePayment.model");
      if (FeePayment) {
        const matchStage = schoolId
          ? { $match: { schoolId: new mongoose.Types.ObjectId(schoolId) } }
          : { $match: {} };
        const payments = await FeePayment.aggregate([
          matchStage,
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" }
            }
          }
        ]);
        totalRevenue = payments.length > 0 ? payments[0].total : 0;
      }
    } catch (feeError) {
      // FeePayment model may not exist yet, set revenue to 0
      console.log("FeePayment model not available:", feeError.message);
      totalRevenue = 0;
    }

    res.status(200).json({
      status: "success",
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalRevenue
      },
    });
  } catch (error) {
    responseStatus(res, 500, "failed", error.message);
  }
};

/**
 * @desc Export Students CSV
 * @route GET /api/v1/admin/export/students
 * @access Private (admin)
 */
exports.exportStudentsController = async (req, res) => {
  try {
    const Student = require("../../models/Students/students.model");
    const schoolId = req.schoolId;
    const students = await Student.find(schoolId ? { schoolId } : {}).select('name email studentId currentClassLevel');

    // Simple CSV generation
    const headers = ['Name', 'Email', 'StudentId', 'Class'];
    const rows = students.map(s => [s.name, s.email, s.studentId || '', (s.currentClassLevel && s.currentClassLevel.name) || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    res.status(200).send(csv);
  } catch (error) {
    responseStatus(res, 500, 'failed', error.message);
  }
};

/**
 * @desc Export Teachers CSV
 * @route GET /api/v1/admin/export/teachers
 * @access Private (admin)
 */
exports.exportTeachersController = async (req, res) => {
  try {
    const Teacher = require("../../models/Staff/teachers.model");
    const schoolId = req.schoolId;
    const teachers = await Teacher.find(schoolId ? { schoolId } : {}).select('name email employeeId subject classLevel');

    const headers = ['Name','Email','EmployeeId','Subject','Class'];
    const rows = teachers.map(t => [t.name, t.email, t.employeeId || '', (t.subject && t.subject.name) || '', (t.classLevel && t.classLevel.name) || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="teachers.csv"');
    res.status(200).send(csv);
  } catch (error) {
    responseStatus(res, 500, 'failed', error.message);
  }
};

