const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/passHash.handler");
const mongoose = require("mongoose");
const Admin = require("../../models/Staff/admin.model");
const Student = require("../../models/Students/students.model");
const Exam = require("../../models/Academic/exams.model");
const Results = require("../../models/Academic/results.model");
const generateToken = require("../../utils/tokenGenerator");
const { resultCalculate } = require("../../functions/result-calculate");
const eventBus = require("../../utils/eventBus");
const EVENTS = require("../../utils/events");

/**
 * Admin registration service for creating a new student.
 *
 * @param {Object} data - The data containing information about the new student.
 * @param {string} data.name - The name of the student.
 * @param {string} data.email - The email of the student.
 * @param {string} data.password - The password of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminRegisterStudentService = async (data, adminId, res) => {
  const {
    name,
    email,
    password,
    dateOfBirth,
    gender,
    phone,
    bloodGroup,
    nationality,
    religion,
    medicalConditions,
    allergies,
    address,
    guardianInfo,
    currentClassLevels,
    academicYear,
    previousSchool,
    previousClass,
    admissionDate
  } = data;

  // Finding admin to get schoolId
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Unauthorized access!");
  }

  // Get schoolId from admin for multi-tenancy
  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if student already exists
  const student = await Student.findOne({ email });
  if (student)
    return responseStatus(res, 400, "failed", "Student with this email already exists");

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create student with all fields
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
    dateOfBirth,
    gender,
    phone,
    bloodGroup,
    nationality,
    religion,
    medicalConditions,
    allergies,
    address,
    guardianInfo,
    currentClassLevels,
    academicYear,
    previousSchool,
    previousClass,
    admissionDate,
    schoolId: schoolId,  // Required for multi-tenancy
  });

  // Saving to admin
  admin.students.push(studentRegistered._id);
  await admin.save();

  // Dispatch Event
  eventBus.dispatch(EVENTS.STUDENT.REGISTERED, studentRegistered);

  return responseStatus(res, 201, "success", studentRegistered);
};
/**
 * Student login service.
 *
 * @param {Object} data - The data containing information about the login.
 * @param {string} data.email - The email of the student.
 * @param {string} data.password - The password of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentLoginService = async (data, res) => {
  const { email, password } = data;
  //find the  user
  const student = await Student.findOne({ email });
  if (!student)
    return responseStatus(res, 401, "failed", "Invalid login credentials");

  //verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched)
    return responseStatus(res, 401, "failed", "Invalid login credentials");

  // Remove password from response
  const studentData = student.toObject();
  delete studentData.password;

  // Generate token with schoolId and role for multi-tenancy
  const token = generateToken(student._id, student.role, student.schoolId);
  return responseStatus(res, 200, "success", { student: studentData, token });
};
/**
 * Get student profile service.
 *
 * @param {string} id - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getStudentsProfileService = async (id, res) => {
  const student = await Student.findById(id).select(
    "-password -createdAt -updatedAt"
  );
  if (!student) return responseStatus(res, 402, "failed", "Student not found");
  return responseStatus(res, 200, "success", student);
};
/**
 * Get all students service (for admin use).
 *
 * @param {string} schoolId - School ID for multi-tenancy filtering
 * @param {Object} filters - Optional filters (currentClassLevel, enrollmentStatus)
 * @param {Object} res - Express response object
 * @returns {Array} - An array of all students for this school.
 */
exports.getAllStudentsByAdminService = async (schoolId, filters = {}, res) => {
  // Build filter query for multi-tenancy (for school admins)
  const query = {};
  if (schoolId) query.schoolId = schoolId;

  // Apply additional filters
  if (filters.currentClassLevel && mongoose.Types.ObjectId.isValid(filters.currentClassLevel)) {
    // Check both singular and array fields for class level
    query.$or = [
      { currentClassLevel: filters.currentClassLevel },
      { currentClassLevels: filters.currentClassLevel }
    ];
  }
  if (filters.enrollmentStatus) {
    query.enrollmentStatus = filters.enrollmentStatus;
  }

  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 100; // Large default but capped
  const skip = (page - 1) * limit;

  const total = await Student.countDocuments(query);
  const result = await Student.find(query)
    .select('-password')
    .populate('currentClassLevel', 'name')
    .populate('currentClassLevels', 'name')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt'); // Sort by newest first for better UX

  return responseStatus(res, 200, "success", {
    students: result,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
};
/**
 * Get a single student by admin.
 *
 * @param {string} studentID - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getStudentByAdminService = async (studentID, res) => {
  const student = await Student.findById(studentID);
  if (!student) return responseStatus(res, 402, "failed", "Student not found");
  return responseStatus(res, 200, "success", student);
};
/**
 * Student update profile service.
 *
 * @param {Object} data - The data containing information about the updated profile.
 * @param {string} userId - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentUpdateProfileService = async (data, userId, res) => {
  const { email, password } = data;
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist)
    return responseStatus(res, 402, "failed", "This email is taken/exist");

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      userId,
      {
        email,
        password: await hashPassword(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return responseStatus(res, 200, "success", student);
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      userId,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return responseStatus(res, 200, "success", student);
  }
};
/**
 * Admin update Student service.
 *
 * @param {Object} data - The data containing information about the updated student.
 * @param {string} studentId - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminUpdateStudentService = async (data, studentId, res) => {
  const { classLevels, academicYear, program, name, email, prefectName } = data;

  //find the student by id
  const studentFound = await Student.findById(studentId, res);
  if (!studentFound)
    return responseStatus(res, 402, "failed", "Student not found");
  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  return responseStatus(res, 200, "success", studentUpdated);
};
/**
 * Student write exam service.
 *
 * @param {string} data - The data containing information about the  exam writing
 * @param {string} studentId - The ID of the student.
 * @param {string} examId - The ID of the exam.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
exports.studentWriteExamService = async (data, studentId, examId, res) => {
  const { answers } = data;
  // find the student
  const student = await Student.findById(studentId);
  if (!student) return responseStatus(res, 404, "failed", "Student not found");
  // finding the exam
  const findExam = await Exam.findById(examId);
  if (!findExam) return responseStatus(res, 404, "failed", "Exam not found");

  // checking if the student already attended the exam
  const alreadyExamTaken = await Results.findOne({ student: student._id });
  if (alreadyExamTaken)
    return responseStatus(res, 400, "failed", "Already written the exam!");
  //checking if the student is suspended or withdrawn
  if (student.isSuspended || student.isWithdrawn)
    return responseStatus(
      res,
      401,
      "failed",
      "You are eligible to attend this exam"
    );
  // getting questions
  const questions = findExam?.questions;
  // checking is students answered all the questions
  if (questions.length !== answers.length)
    return responseStatus(
      res,
      406,
      "failed",
      "You have not answered all the questions"
    );
  // calculating results
  const result = await resultCalculate(questions, answers, findExam);
  // creating results
  const createResult = await Results.create({
    studentId: student._id,
    teacher: findExam.createdBy,
    exam: findExam._id,
    score: result.score,
    grade: result.grade,
    passMark: findExam.passMark,
    status: result.status,
    remarks: result.remarks,
    answeredQuestions: result.answeredQuestions,
    classLevel: findExam.classLevel,
    academicTerm: findExam.academicTerm,
    academicYear: findExam.academicYear,
  });
  // updating student's total scores and number of attempts
  student.examResults.push(createResult._id);
  await student.save();

  // Dispatch Event
  eventBus.dispatch(EVENTS.STUDENT.EXAM_COMPLETED, { student, result: createResult });

  return responseStatus(res, 200, "success", "Answer Submitted");
};

/**
 * Student Self Registration service
 * Allows students to create their own account
 *
 * @param {Object} data - Registration data
 * @param {string} data.name - Student name
 * @param {string} data.email - Student email
 * @param {string} data.password - Student password
 * @param {Object} res - Response object
 */
exports.studentSelfRegisterService = async (data, res) => {
  try {
    const { name, email, password } = data;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return responseStatus(res, 402, "failed", "Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // For self-registration, we need a default schoolId
    // You can set this from environment or create a default school
    const defaultSchoolId = process.env.DEFAULT_SCHOOL_ID || "60d5ec49c1234567890abcde";

    // Create new student
    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      schoolId: defaultSchoolId,
    });

    return responseStatus(res, 201, "success", {
      message: "Registration successful. Please login.",
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
      },
    });
  } catch (error) {
    return responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * Get Student Dashboard Service
 * Returns enrolled courses, upcoming assignments, today's assignments and basic counts
 */
exports.getStudentDashboardService = async (studentId, schoolId) => {
  const Enrollment = require("../../models/Academic/Enrollment.model");
  const Assignment = require("../../models/Academic/Assignment.model");
  const Student = require("../../models/Students/students.model");

  const student = await Student.findById(studentId).select('currentClassLevel currentClassLevels schoolId');
  if (!student) return { error: 'Student not found' };

  const classLevels = [];
  if (student.currentClassLevel) classLevels.push(student.currentClassLevel);
  if (Array.isArray(student.currentClassLevels)) classLevels.push(...student.currentClassLevels);

  // Enrolled courses (from Enrollment model)
  const enrollments = await Enrollment.find({ student: studentId, schoolId, status: 'active' })
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .limit(20);

  // Upcoming assignments for student's classes
  const now = new Date();
  const upcomingAssignments = await Assignment.find({
    schoolId,
    classLevel: { $in: classLevels },
    dueDate: { $gt: now }
  })
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .sort({ dueDate: 1 })
    .limit(8);

  // Today's assignments (due today)
  const startOfDay = new Date(now);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23,59,59,999);

  const todaysAssignments = await Assignment.find({
    schoolId,
    classLevel: { $in: classLevels },
    dueDate: { $gte: startOfDay, $lte: endOfDay }
  })
    .populate('subject', 'name')
    .populate('classLevel', 'name')
    .sort({ dueDate: 1 });

  const data = {
    totalEnrolled: enrollments.length,
    upcomingAssignmentsCount: upcomingAssignments.length,
    upcomingAssignments,
    todaysAssignments,
    enrollments,
  };

  return { success: true, data };
};
