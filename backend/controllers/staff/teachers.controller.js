const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/staff/teachers.service.prisma_impl"
  : "../../services/staff/teachers.service";

const {
  createTeacherService,
  teacherLoginService,
  getAllTeachersService,
  getTeacherProfileService,
  updateTeacherProfileService,
  adminUpdateTeacherProfileService,
} = require(servicePath);

// Conditionally load ProfileQRCode model (Mongoose only)
let ProfileQRCode = null;
if (!usePrisma) {
  ProfileQRCode = require('../../models/ProfileQRCode.model');
}
const { uploadSingle, processAttachments } = require('../../middlewares/fileUpload');

// card generation
const qrGenerator = require('../../services/qrcode/qrGenerator.service');
const documentGenerator = require('../../services/documentGenerator');

// Generate teacher/staff card PDF
exports.generateTeacherCardController = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const requesterRole = req.userRole;
    const requesterId = req.userAuth && req.userAuth.id;
    if (requesterRole === 'teacher' && requesterId !== teacherId) {
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }

    // Fetch teacher
    let teacher = null;
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
      await prisma.$disconnect();
    } else {
      const Teacher = require('../../models/Staff/teachers.model');
      teacher = await Teacher.findById(teacherId).lean();
    }
    if (!teacher) return responseStatus(res, 404, 'failed', 'Teacher not found');

    const { dataUrl } = await qrGenerator.generateQRCodeImage({ id: teacher.id || teacher._id, type: 'staff' });
    const pdfBuffer = await documentGenerator.generateStaffCard({ staff: teacher, qrDataUrl: dataUrl });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="staff-${teacherId}-card.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// Upload or update teacher avatar and generate QR linking to the avatar URL
exports.uploadTeacherAvatarController = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const requesterRole = req.userRole;
    const requesterId = req.userAuth && req.userAuth.id;
    if (requesterRole === 'teacher' && requesterId !== teacherId) {
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }
    if (!req.file) return responseStatus(res, 400, 'failed', 'No avatar file uploaded');
    req.files = [req.file];
    await processAttachments(req, res, async () => {});
    const attachments = req.body.attachments || [];
    if (attachments.length === 0) return responseStatus(res, 500, 'failed', 'Failed to process uploaded avatar');
    const avatarUrl = attachments[0].url;

    // Update Teacher record
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.teacher.update({ where: { id: teacherId }, data: { avatar: avatarUrl } });
      await prisma.$disconnect();
    } else {
      const Teacher = require('../../models/Staff/teachers.model');
      await Teacher.findByIdAndUpdate(teacherId, { avatar: avatarUrl }, { new: true });
    }

    const qrGenerator = require('../../services/qrcode/qrGenerator.service');
    const payload = { id: teacherId, type: 'teacher', avatarUrl };
    const { data, dataUrl } = await qrGenerator.generateQRCodeImage(payload);

    try {
      await ProfileQRCode.findOneAndUpdate(
        { entityType: 'teacher', entityId: teacherId },
        { qrCodeData: data, qrCodeImage: dataUrl, entityType: 'teacher', entityId: teacherId },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('Failed to persist ProfileQRCode for teacher', e.message || e);
    }

    return responseStatus(res, 200, 'success', { avatar: avatarUrl, qrData: data, qrImage: dataUrl });
  } catch (error) {
    console.error('uploadTeacherAvatarController error', error);
    return responseStatus(res, 500, 'failed', error.message);
  }
};

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
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { getPrisma } = require('../../lib/prismaClient');
      const prisma = getPrisma();
      if (!prisma) return responseStatus(res, 500, 'failed', 'Database unavailable');

      // Ensure multi-tenant safety: only delete within the requester's school.
      const existing = await prisma.teacher.findFirst({ where: { id, schoolId: String(req.schoolId || '') } });
      if (!existing) return responseStatus(res, 404, 'failed', 'Teacher not found');
      await prisma.teacher.delete({ where: { id } });
      return responseStatus(res, 200, 'success', existing, 'Teacher deleted');
    }

    const Teacher = require('../../models/Staff/teachers.model');
    const deleted = await Teacher.findOneAndDelete({ _id: id, schoolId: req.schoolId });
    if (!deleted) return responseStatus(res, 404, 'failed', 'Teacher not found');
    return responseStatus(res, 200, 'success', deleted, 'Teacher deleted');
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
    const { getTeacherDashboardService } = require(servicePath);
    const result = await getTeacherDashboardService(teacherId, schoolId);
    if (result.error) return responseStatus(res, 404, "failed", result.error);
    responseStatus(res, 200, "success", result.data);
  } catch (error) {
    responseStatus(res, 500, "failed", error.message);
  }
};
