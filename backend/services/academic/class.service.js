// Import necessary models
const ClassLevel = require("../../models/Academic/class.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler");
/**
 * Create class service.
 *
 * @param {Object} data - The data containing information about the class.
 * @param {string} data.name - The name of the class.
 * @param {string} data.description - The description of the class.
 * @param {string} userId - The ID of the user creating the class.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createClassLevelService = async (data, userId, res) => {
  const { name, description } = data;

  // Find the admin to get schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  // Get schoolId - required for multi-tenancy
  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if the class already exists for this school
  const classFound = await ClassLevel.findOne({ name, schoolId });
  if (classFound) {
    return responseStatus(res, 400, "failed", "Class already exists");
  }

  // Create the class with schoolId
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: userId,
    schoolId: schoolId,
  });

  // Push the class into the admin's classLevels array
  if (admin) {
    admin.classLevels.push(classCreated._id);
    await admin.save();
  }

  // Send the response
  return responseStatus(res, 200, "success", classCreated);
};

/**
 * Get all classes service.
 * Includes student count for each class.
 *
 * @param {string} schoolId - Optional school ID for multi-tenancy filtering
 * @returns {Array} - An array of all classes with student counts.
 */
exports.getAllClassesService = async (schoolId) => {
  const Student = require("../../models/Students/students.model");

  // If schoolId provided, filter by it (for school admins)
  // Otherwise return all (for super admin)
  const filter = schoolId ? { schoolId } : {};
  const classes = await ClassLevel.find(filter).populate('createdBy', 'name email');

  // Get student counts for each class
  const classesWithCounts = await Promise.all(
    classes.map(async (classLevel) => {
      // Count students that have this class in currentClassLevel OR currentClassLevels
      const studentCount = await Student.countDocuments({
        schoolId: schoolId,
        $or: [
          { currentClassLevel: classLevel._id },
          { currentClassLevels: classLevel._id }
        ]
      });

      // Convert to plain object and add studentCount
      const classObj = classLevel.toObject();
      classObj.studentCount = studentCount;
      return classObj;
    })
  );

  return classesWithCounts;
};

/**
 * Get a single class by ID service.
 *
 * @param {string} id - The ID of the class.
 * @returns {Object} - The class object with populated students, subjects, and teachers.
 */
exports.getClassLevelsService = async (id) => {
  return await ClassLevel.findById(id)
    .populate('students', 'name email studentId')
    .populate('subjects', 'name code description')
    .populate('teachers', 'name email')
    .populate('createdBy', 'name email');
};

/**
 * Update class data service.
 *
 * @param {Object} data - The data containing updated information about the class.
 * @param {string} data.name - The updated name of the class.
 * @param {string} data.description - The updated description of the class.
 * @param {string} id - The ID of the class to be updated.
 * @param {string} userId - The ID of the user updating the class.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateClassLevelService = async (data, id, userId, res) => {
  const { name, description } = data;

  // Check if the updated name already exists (but not for this class)
  const classFound = await ClassLevel.findOne({ name, _id: { $ne: id } });
  if (classFound) {
    return responseStatus(res, 400, "failed", "Class name already exists");
  }

  // Update the class
  const classLevel = await ClassLevel.findByIdAndUpdate(
    id,
    {
      name,
      description,
      createdBy: userId,
    },
    {
      new: true,
    }
  );

  // Send the response
  return responseStatus(res, 200, "success", classLevel);
};

/**
 * Delete class data service.
 *
 * @param {string} id - The ID of the class to be deleted.
 * @returns {Object} - The deleted class object.
 */
exports.deleteClassLevelService = async (id) => {
  return await ClassLevel.findByIdAndDelete(id);
};

/**
 * Get subjects for a class.
 * Checks both the class's subjects array and teachers assigned to this class.
 *
 * @param {string} classId - The ID of the class.
 * @param {string} schoolId - School ID for multi-tenancy.
 * @returns {Array} - Array of subjects for this class.
 */
exports.getSubjectsByClassService = async (classId, schoolId) => {
  const Subject = require("../../models/Academic/subject.model");
  const Teacher = require("../../models/Staff/teachers.model");

  // First, get subjects directly from the class
  const classLevel = await ClassLevel.findById(classId).populate('subjects');
  const classSubjects = classLevel?.subjects || [];

  // Also get subjects from teachers assigned to this class
  const teachers = await Teacher.find({
    classLevel: classId,
    schoolId: schoolId
  }).populate('subject').populate('subjects');

  // Collect all subject IDs
  const subjectIds = new Set(classSubjects.map(s => s._id.toString()));

  // Add subjects from teachers
  teachers.forEach(teacher => {
    if (teacher.subject) {
      subjectIds.add(teacher.subject._id?.toString() || teacher.subject.toString());
    }
    if (teacher.subjects) {
      teacher.subjects.forEach(s => {
        subjectIds.add(s._id?.toString() || s.toString());
      });
    }
  });

  // Fetch all unique subjects
  const allSubjects = await Subject.find({
    _id: { $in: Array.from(subjectIds) },
    schoolId: schoolId
  }).populate('teacher', 'name email');

  return allSubjects;
};

/**
 * Get teachers for a class.
 *
 * @param {string} classId - The ID of the class.
 * @param {string} schoolId - School ID for multi-tenancy.
 * @returns {Array} - Array of teachers for this class.
 */
exports.getTeachersByClassService = async (classId, schoolId) => {
  const Teacher = require("../../models/Staff/teachers.model");

  return await Teacher.find({
    $or: [
      { classLevel: classId },
      { assignedClasses: classId }
    ],
    schoolId: schoolId,
    isWithdrawn: false
  }).populate('subject', 'name').select('-password');
};

/**
 * Assign a subject to a class.
 *
 * @param {string} classId - The ID of the class.
 * @param {string} subjectId - The ID of the subject.
 * @param {Object} res - Express response object.
 */
exports.assignSubjectToClassService = async (classId, subjectId, res) => {
  const classLevel = await ClassLevel.findById(classId);
  if (!classLevel) {
    return responseStatus(res, 404, "failed", "Class not found");
  }

  // Check if subject already assigned
  if (classLevel.subjects.includes(subjectId)) {
    return responseStatus(res, 400, "failed", "Subject already assigned to this class");
  }

  classLevel.subjects.push(subjectId);
  await classLevel.save();

  return responseStatus(res, 200, "success", classLevel);
};

/**
 * Remove a subject from a class.
 *
 * @param {string} classId - The ID of the class.
 * @param {string} subjectId - The ID of the subject.
 * @param {Object} res - Express response object.
 */
exports.removeSubjectFromClassService = async (classId, subjectId, res) => {
  const classLevel = await ClassLevel.findById(classId);
  if (!classLevel) {
    return responseStatus(res, 404, "failed", "Class not found");
  }

  classLevel.subjects = classLevel.subjects.filter(s => s.toString() !== subjectId);
  await classLevel.save();

  return responseStatus(res, 200, "success", classLevel);
};
