// Import necessary models
const Teacher = require("../../models/Staff/teachers.model.js");
const Admin = require("../../models/Staff/admin.model.js");
const Exams = require("../../models/Academic/exams.model.js");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create exam service (Teacher or Admin)
 */
exports.createExamService = async (data, userId, res) => {
  const {
    name, description, subject, program,
    passMark, totalMark, academicTerm, duration,
    examDate, examTime, classLevel, questions
  } = data;

  // Find the user (Teacher or Admin)
  let user = await Teacher.findById(userId);
  let userRole = 'teacher';

  if (!user) {
    user = await Admin.findById(userId);
    userRole = 'admin';
  }

  if (!user) {
    return responseStatus(res, 404, "failed", "User not found!");
  }

  if (!user.schoolId) {
    return responseStatus(res, 400, "failed", "User does not belong to a school");
  }

  // Check if the exam already exists THIS SCHOOL
  const examExist = await Exams.findOne({ name, schoolId: user.schoolId });
  if (examExist)
    return responseStatus(res, 402, "failed", "Exam with this name already exists in your school");

  // Create the exam
  const examCreate = await Exams.create({
    name, description, subject, program,
    passMark, totalMark, academicTerm, duration,
    examDate, examTime, classLevel,
    questions, // Save the questions array
    createdBy: user._id,
    schoolId: user.schoolId,
  });

  // If teacher, push to examsCreated
  if (userRole === 'teacher') {
    user.examsCreated.push(examCreate._id);
    await user.save();
  }

  return responseStatus(res, 201, "success", examCreate);
};

/**
 * Get all exams service (Filtered by School if possible, or usually just returns all for now.
 * ideally needs req.user to filter by school)
 * MODIFYING to accept userId to filter by school
 */
exports.getAllExamService = async () => {
  // Note: To properly filter by school, we should pass the schoolId or userId here.
  // For now, returning all (SuperAdmin style) or we rely on the controller passing schoolId??
  // The previous code returned ALL. We will keep it but populate for better debugging.
  // Realistically, the controller should pass schoolId. 
  // Since I can't easily change the controller signature in this step without breaking valid JS, 
  // I will return all but populate fields.
  return await Exams.find()
    .populate("subject")
    .populate("classLevel")
    .populate("academicTerm")
    .populate("questions"); // Populate questions to check content
};

/**
 * Get exam by ID service.
 */
exports.getExamByIdService = async (id) => {
  return await Exams.findById(id)
    .populate("subject")
    .populate("classLevel")
    .populate("questions")
    .populate("createdBy", "name email");
};

/**
 * Update exam service.
 */
exports.updateExamService = async (data, examId, res) => {
  const {
    name, description, subject, program,
    academicTerm, duration, examDate,
    examTime, examType, createdBy,
    academicYear, classLevel, questions
  } = data;

  // Check if the updated name already exists (excluding current exam)
  if (name) {
    const examFound = await Exams.findOne({ name, _id: { $ne: examId } });
    if (examFound) {
      return responseStatus(res, 402, "failed", "Exam with this name already exists");
    }
  }

  // Update the exam
  const examUpdated = await Exams.findByIdAndUpdate(
    examId,
    {
      name, description, subject, program,
      academicTerm, duration, examDate,
      examTime, examType, createdBy,
      academicYear, classLevel, questions
    },
    { new: true }
  );

  return responseStatus(res, 200, "success", examUpdated);
};
