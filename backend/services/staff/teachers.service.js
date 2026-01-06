const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/passHash.handler");
const Teacher = require("../../models/Staff/teachers.model");
const Admin = require("../../models/Staff/admin.model");
const generateToken = require("../../utils/tokenGenerator");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler.js");

if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
  module.exports = require('./teachers.service.prisma_impl');
  return;
}

/**
 * Service to create a new teacher
 * @param {Object} data - Teacher data including name, email, and password
 * @param {string} adminId - ID of the admin creating the teacher
 * @param {Object} res - Express response object
 * @returns {Object} - Response object indicating success or failure
 */
exports.createTeacherService = async (data, adminId, res) => {
  const {
    name,
    email,
    password,
    phone,
    dateOfBirth,
    gender,
    employeeId,
    department,
    qualification,
    qualifications,
    specialization,
    specializations,
    experience,
    dateOfJoining,
    joiningDate,
    // Support both singular and plural field names from frontend
    subject,
    subjects,
    classLevel,
    classLevels,
    academicYear,
    academicTerm,
    address,
    employmentType,
    salary,
    nationality
  } = data;

  // Check if the teacher already exists
  const existTeacher = await Teacher.findOne({ email });
  if (existTeacher)
    return responseStatus(res, 400, "failed", "Teacher with this email already exists");

  // Finding admin to get schoolId
  const admin = await Admin.findById(adminId);
  if (!admin) return responseStatus(res, 401, "fail", "Unauthorized access");

  // Get schoolId from admin for multi-tenancy
  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Hashing password
  const hashedPassword = await hashPassword(password);

  // Handle both singular and plural field names
  const teacherSubject = subject || subjects;
  const teacherClassLevel = classLevel || classLevels;
  const teacherQualification = qualifications || qualification;
  const teacherSpecialization = specializations || specialization;
  const teacherJoiningDate = joiningDate || dateOfJoining;

  // Create teacher with all fields
  const createTeacher = await Teacher.create({
    name,
    email,
    password: hashedPassword,
    phone,
    dateOfBirth,
    gender,
    employeeId,
    department,
    qualifications: teacherQualification,
    specialization: teacherSpecialization,
    experience,
    dateEmployed: teacherJoiningDate,
    subject: teacherSubject,
    classLevel: teacherClassLevel,
    academicYear,
    academicTerm,
    address,
    nationality,
    employmentType,
    salary,
    createdBy: admin._id,
    schoolId: schoolId,  // Required for multi-tenancy
  });

  admin.teachers.push(createTeacher._id);
  await admin.save();

  return responseStatus(res, 201, "success", createTeacher);
};

/**
 * Service for teacher login
 * @param {Object} data - Login credentials including email and password
 * @returns {Object} - Response object with teacher details and token
 */
exports.teacherLoginService = async (data, res) => {
  const { email, password } = data;

  // Checking if the teacher exists
  const teacherFound = await Teacher.findOne({ email });

  if (!teacherFound)
    return responseStatus(res, 401, "failed", "Invalid login credentials");

  // Comparing password with the hashed one
  const isMatched = await isPassMatched(password, teacherFound?.password);

  if (!isMatched)
    return responseStatus(res, 401, "failed", "Invalid login credentials");

  // Remove password from response
  const teacherData = teacherFound.toObject();
  delete teacherData.password;

  // Generate token with schoolId and role for multi-tenancy
  const token = generateToken(teacherFound._id, teacherFound.role, teacherFound.schoolId);

  return responseStatus(res, 200, "success", { teacher: teacherData, token });
};

/**
 * Service to get all teachers
 * @param {string} schoolId - School ID for multi-tenancy filtering
 * @returns {Array} - Array of all teacher objects for this school
 */
exports.getAllTeachersService = async (schoolId, options = {}) => {
  const mongoose = require('mongoose');

  // If schoolId is provided, filter by it (for school admins)
  // Otherwise return all (for super admin)
  let filter = {};
  if (schoolId) {
    // Convert string schoolId to ObjectId for proper matching
    try {
      filter.schoolId = new mongoose.Types.ObjectId(schoolId);
    } catch (e) {
      // If conversion fails, use as-is (might be already ObjectId)
      filter.schoolId = schoolId;
    }
  }

  const page = parseInt(options.page) || 1;
  const limit = Math.min(parseInt(options.limit) || 25, 100);
  const skip = (page - 1) * limit;

  const total = await Teacher.countDocuments(filter);
  const teachers = await Teacher.find(filter)
    .select('-password')
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  return {
    teachers,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Service to get teacher profile by ID
 * @param {string} teacherId - ID of the teacher
 * @returns {Object} - Teacher profile object with selected fields
 */
exports.getTeacherProfileService = async (teacherId) => {
  return await Teacher.findById(teacherId).select(
    "-createdAt -updatedAt -password"
  );
};

/**
 * Service to update teacher profile
 * @param {Object} data - Updated data for the teacher
 * @param {string} teacherId - ID of the teacher
 * @param {Object} res - Express response object
 * @returns {Object} - Response object with updated teacher details and token
 */
exports.updateTeacherProfileService = async (data, teacherId, res) => {
  const { name, email, password } = data;

  // Checking if the email already exists for another teacher
  if (email) {
    const emailExist = await Teacher.findOne({
      email,
      _id: { $ne: teacherId },
    });
    if (emailExist)
      return responseStatus(res, 402, "failed", "Email already in use");
  }

  // Hashing password if provided
  const hashedPassword = password ? await hashPassword(password) : null;

  const updateData = {
    name,
    email,
    ...(hashedPassword && { password: hashedPassword }),
  };

  // Find and update teacher
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    teacherId,
    updateData,
    { new: true }
  );

  return { teacher: updatedTeacher, token: generateToken(updatedTeacher._id) };
};

/**
 * Service for admin to update teacher profile
 * @param {Object} data - Updated data for the teacher
 * @param {string} teacherId - ID of the teacher
 * @returns {Object|string} - Updated teacher object or error message
 */
exports.adminUpdateTeacherProfileService = async (data, teacherId) => {
  const { program, classLevel, academicYear, subject } = data;

  // Checking if the teacher exists
  const teacherExist = await Teacher.findById(teacherId);
  if (!teacherExist) return "No such teacher found";

  // Check if teacher is withdrawn
  if (teacherExist.isWithdrawn) return "Action denied, teacher is withdrawn";

  // Updating program
  if (program) {
    teacherExist.program = program;
    await teacherExist.save();
  }

  // Updating classLevel
  if (classLevel) {
    teacherExist.classLevel = classLevel;
    await teacherExist.save();
  }

  // Updating academic year
  if (academicYear) {
    teacherExist.academicYear = academicYear;
    await teacherExist.save();
  }

  // Updating subject
  if (subject) {
    teacherExist.subject = subject;
    await teacherExist.save();
  }

  return teacherExist;
};

// Delete teacher account (No implementation provided)
// exports.deleteTeacherAccountService = async () => {};

/**
 * Get Teacher Dashboard Service
 * Returns classes taught, upcoming assignments posted by teacher, and counts
 */
exports.getTeacherDashboardService = async (teacherId, schoolId) => {
  const Assignment = require("../../models/Academic/Assignment.model");
  const Teacher = require("../../models/Staff/teachers.model");

  const teacher = await Teacher.findById(teacherId).select('classes schoolId');
  if (!teacher) return { error: 'Teacher not found' };

  // Classes assigned (if teacher.classes exists)
  const classes = teacher.classes || [];

  // Upcoming assignments created by teacher
  const now = new Date();
  const upcomingAssignments = await Assignment.find({
    schoolId,
    teacher: teacherId,
    dueDate: { $gt: now }
  })
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .sort({ dueDate: 1 })
    .limit(8);

  // Today's assignments
  const startOfDay = new Date(now);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23,59,59,999);

  const todaysAssignments = await Assignment.find({
    schoolId,
    teacher: teacherId,
    dueDate: { $gte: startOfDay, $lte: endOfDay }
  })
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .sort({ dueDate: 1 });

  return {
    success: true,
    data: {
      classes,
      upcomingAssignments,
      todaysAssignments,
      counts: {
        classes: classes.length,
        upcomingAssignments: upcomingAssignments.length,
      }
    }
  };
};
