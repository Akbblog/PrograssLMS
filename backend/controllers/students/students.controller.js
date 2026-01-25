const responseStatus = require("../../handlers/responseStatus.handler.js");

// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? "../../services/students/students.service.prisma_impl"
  : "../../services/students/students.service";

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
} = require(servicePath);

const { uploadSingle, processAttachments } = require('../../middlewares/fileUpload');

// Conditionally load ProfileQRCode model (Mongoose only)
let ProfileQRCode = null;
if (!usePrisma) {
  ProfileQRCode = require('../../models/ProfileQRCode.model');
}

// For card generation
const qrGenerator = require('../../services/qrcode/qrGenerator.service');
const documentGenerator = require('../../services/documentGenerator');

// Generate student card PDF
exports.generateStudentCardController = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Authorization: allow admin/teacher or the student themself
    const requesterRole = req.userRole;
    const requesterId = req.userAuth && req.userAuth.id;
    if (requesterRole === 'student' && requesterId !== studentId) {
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }

    // Fetch student depending on DB driver
    let student = null;
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      student = await prisma.student.findUnique({ where: { id: studentId } });
      await prisma.$disconnect();
    } else {
      const Student = require('../../models/Students/students.model');
      student = await Student.findById(studentId).lean();
    }
    if (!student) return responseStatus(res, 404, 'failed', 'Student not found');

    const { dataUrl } = await qrGenerator.generateQRCodeImage({ id: student.id || student._id, type: 'student' });
    
    // Fetch enhanced data for card
    let attendanceData = null;
    let academicData = null;
    
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Get attendance data - simplified version
      try {
        const attendanceRecords = await prisma.attendance.findMany({
          where: { 
            records: {
              contains: studentId
            }
          }
        });
        
        if (attendanceRecords.length > 0) {
          // Count present days from attendance records
          let presentCount = 0;
          let totalRecords = 0;
          
          for (const record of attendanceRecords) {
            try {
              const records = JSON.parse(record.records || '[]');
              const studentRecord = records.find(r => r.studentId === studentId);
              if (studentRecord) {
                totalRecords++;
                if (studentRecord.status === 'present') {
                  presentCount++;
                }
              }
            } catch (e) {
              // Skip invalid records
            }
          }
          
          if (totalRecords > 0) {
            attendanceData = {
              percentage: Math.round((presentCount / totalRecords) * 100),
              totalDays: totalRecords,
              presentDays: presentCount
            };
          }
        }
      } catch (error) {
        console.log('Could not fetch attendance data:', error.message);
      }
      
      // Get academic data - simplified version
      try {
        const enrollments = await prisma.enrollment.findMany({
          where: { studentId: studentId }
        });
        
        if (enrollments.length > 0) {
          const latestEnrollment = enrollments[0];
          
          // Get class level name
          let className = 'N/A';
          if (latestEnrollment.classLevel) {
            const classLevel = await prisma.classLevel.findUnique({
              where: { id: latestEnrollment.classLevel }
            });
            className = classLevel ? classLevel.name : 'N/A';
          }
          
          academicData = {
            gpa: 'N/A',
            class: className,
            session: latestEnrollment.academicYear || 'N/A',
            totalSubjects: enrollments.length,
            passedSubjects: enrollments.length // Simplified - assume all passed
          };
        }
      } catch (error) {
        console.log('Could not fetch academic data:', error.message);
      }
      
      await prisma.$disconnect();
    } else {
      // Mongoose fallback - implement similar queries for MongoDB
      // This is a simplified version - you may need to adjust based on your MongoDB schema
      try {
        const Attendance = require('../../models/Attendance/attendance.model');
        const attendanceRecords = await Attendance.find({ studentId: studentId });
        if (attendanceRecords.length > 0) {
          const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
          attendanceData = {
            percentage: Math.round((presentCount / attendanceRecords.length) * 100),
            totalDays: attendanceRecords.length,
            presentDays: presentCount
          };
        }
      } catch (error) {
        console.log('Could not fetch attendance data:', error.message);
      }
      
      try {
        const Enrollment = require('../../models/Enrollments/enrollments.model');
        const enrollments = await Enrollment.find({ studentId: studentId }).populate('class').populate('academicSession').populate('results.subject');
        if (enrollments.length > 0) {
          const latestEnrollment = enrollments[0];
          const totalSubjects = latestEnrollment.results.length;
          const passedSubjects = latestEnrollment.results.filter(result => result.grade !== 'F').length;
          const gpa = (passedSubjects / totalSubjects * 4).toFixed(2);
          
          academicData = {
            gpa: gpa,
            class: latestEnrollment.class.name,
            session: latestEnrollment.academicSession.name,
            totalSubjects: totalSubjects,
            passedSubjects: passedSubjects
          };
        }
      } catch (error) {
        console.log('Could not fetch academic data:', error.message);
      }
    }
    
    const pdfBuffer = await documentGenerator.generateStudentCard({ 
      student, 
      qrDataUrl: dataUrl,
      attendanceData,
      academicData
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="student-${studentId}-card.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// Upload or update student avatar and generate QR linking to the avatar URL
exports.uploadStudentAvatarController = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Authorization: student can update own, admin can update any
    const requesterRole = req.userRole;
    const requesterId = req.userAuth && req.userAuth.id;
    if (requesterRole === 'student' && requesterId !== studentId) {
      return responseStatus(res, 403, 'failed', 'Unauthorized');
    }

    // Use multer single middleware then reuse processAttachments by putting req.file into req.files
    // Note: router will call uploadSingle and then this handler; here we assume req.file exists
    if (!req.file) return responseStatus(res, 400, 'failed', 'No avatar file uploaded');
    // Reuse existing processAttachments by temporarily setting req.files
    req.files = [req.file];
    await processAttachments(req, res, async () => {});
    const attachments = req.body.attachments || [];
    if (attachments.length === 0) return responseStatus(res, 500, 'failed', 'Failed to process uploaded avatar');
    const avatarUrl = attachments[0].url;

    // Update Student record (mongoose or prisma)
    if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.student.update({ where: { id: studentId }, data: { avatar: avatarUrl } });
      await prisma.$disconnect();
    } else {
      const Student = require('../../models/Students/students.model');
      await Student.findByIdAndUpdate(studentId, { avatar: avatarUrl }, { new: true });
    }

    // Generate QR payload linking to avatar URL
    const qrGenerator = require('../../services/qrcode/qrGenerator.service');
    const payload = { id: studentId, type: 'student', avatarUrl };
    const { data, dataUrl } = await qrGenerator.generateQRCodeImage(payload);

    // Persist QR mapping in ProfileQRCode for later lookup
    try {
      const ProfileQRCodeModel = ProfileQRCode;
      // Upsert-like behavior for mongoose
      await ProfileQRCodeModel.findOneAndUpdate(
        { entityType: 'student', entityId: studentId },
        { qrCodeData: data, qrCodeImage: dataUrl, entityType: 'student', entityId: studentId },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('Failed to persist ProfileQRCode for student', e.message || e);
    }

    return responseStatus(res, 200, 'success', { avatar: avatarUrl, qrData: data, qrImage: dataUrl });
  } catch (error) {
    console.error('uploadStudentAvatarController error', error);
    return responseStatus(res, 500, 'failed', error.message);
  }
};

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
    // Allow students to fetch their own profile via this route.
    const requesterRole = req.userRole;
    const requesterId = req.userAuth && req.userAuth.id;
    if (requesterRole === 'student' && requesterId === studentId) {
      // Delegate to the student profile service for self requests
      await getStudentsProfileService(requesterId, res);
      return;
    }

    // Otherwise require admin behavior
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
