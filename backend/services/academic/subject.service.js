// Import necessary models
const Subject = require("../../models/Academic/subject.model");
// const ClassLevel = require("../../models/Academic/class.model");
const Program = require("../../models/Academic/program.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create Subject service (Simple - without program requirement).
 * This is used when creating subjects on-the-fly during teacher creation.
 *
 * @param {Object} data - The data containing information about the Subject.
 * @param {string} data.name - The name of the Subject.
 * @param {string} data.description - The description of the Subject.
 * @param {string} userId - The ID of the user creating the Subject.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createSimpleSubjectService = async (data, userId, res) => {
  const { name, description } = data;

  // Find the admin to get schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  // Get schoolId for multi-tenancy
  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if the Subject already exists for this school
  const SubjectFound = await Subject.findOne({ name, schoolId });
  if (SubjectFound) {
    return responseStatus(res, 400, "failed", "Subject already exists");
  }

  // Create the Subject with schoolId
  const SubjectCreated = await Subject.create({
    name,
    description,
    createdBy: userId,
    schoolId: schoolId,
  });

  // Send the response
  return responseStatus(res, 201, "success", SubjectCreated);
};

/**
 * Create Subject service.
 *
 * @param {Object} data - The data containing information about the Subject.
 * @param {string} data.name - The name of the Subject.
 * @param {string} data.description - The description of the Subject.
 * @param {string} data.academicTerm - The academic term associated with the Subject.
 * @param {string} programId - The ID of the program the Subject is associated with.
 * @param {string} userId - The ID of the user creating the Subject.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createSubjectService = async (data, programId, userId, res) => {
  const { name, description, academicTerm } = data;

  // Get the admin to find their schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Find the program
  const programFound = await Program.findById(programId);
  if (!programFound)
    return responseStatus(res, 404, "failed", "Program not found");

  // Check if the Subject already exists for this school
  const SubjectFound = await Subject.findOne({ name, schoolId });
  if (SubjectFound) {
    return responseStatus(res, 400, "failed", "Subject already exists");
  }

  // Create the Subject with schoolId
  const SubjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    program: programId,
    schoolId,
    createdBy: userId,
  });

  // Push the object ID to program
  programFound.subjects.push(SubjectCreated._id);
  await programFound.save();

  // Send the response
  return responseStatus(res, 201, "success", SubjectCreated);
};

/**
 * Get all Subjects service.
 * Includes teacher information for each subject.
 *
 * @param {string} schoolId - Optional school ID for multi-tenancy filtering
 * @returns {Array} - An array of all Subjects with teacher info.
 */
exports.getAllSubjectsService = async (schoolId) => {
  const Teacher = require("../../models/Staff/teachers.model");

  // If schoolId provided, filter by it (for school admins)
  // Otherwise return all (for super admin)
  const filter = schoolId ? { schoolId } : {};
  const subjects = await Subject.find(filter).populate('teacher', 'name email');

  // For subjects without direct teacher assignment, find teacher via Teacher model
  const subjectsWithTeachers = await Promise.all(
    subjects.map(async (subject) => {
      const subjectObj = subject.toObject();

      // If no teacher directly assigned, look for teacher who has this subject
      if (!subjectObj.teacher) {
        const teacher = await Teacher.findOne({
          schoolId: schoolId,
          $or: [
            { subject: subject._id },
            { subjects: subject._id }
          ],
          isWithdrawn: false
        }).select('name email');

        if (teacher) {
          subjectObj.teacher = teacher;
        }
      }

      return subjectObj;
    })
  );

  return subjectsWithTeachers;
};

/**
 * Get a single Subject by ID service.
 *
 * @param {string} id - The ID of the Subject.
 * @returns {Object} - The Subject object.
 */
exports.getSubjectsService = async (id) => {
  return await Subject.findById(id);
};

/**
 * Update Subject data service.
 *
 * @param {Object} data - The data containing updated information about the Subject.
 * @param {string} data.name - The updated name of the Subject.
 * @param {string} data.description - The updated description of the Subject.
 * @param {string} data.academicTerm - The updated academic term associated with the Subject.
 * @param {string} id - The ID of the Subject to be updated.
 * @param {string} userId - The ID of the user updating the Subject.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateSubjectService = async (data, id, userId, res) => {
  const { name, description, academicTerm } = data;

  // Get the admin to find their schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  const schoolId = admin.schoolId;

  // Check if the updated name already exists for this school (but not for this subject)
  const subjectFound = await Subject.findOne({ name, schoolId, _id: { $ne: id } });
  if (subjectFound) {
    return responseStatus(res, 400, "failed", "Subject name already exists");
  }

  // Update the Subject
  const updatedSubject = await Subject.findByIdAndUpdate(
    id,
    {
      name,
      description,
      academicTerm,
      createdBy: userId,
    },
    {
      new: true,
    }
  );

  // Send the response
  return responseStatus(res, 200, "success", updatedSubject);
};

/**
 * Delete Subject data service.
 *
 * @param {string} id - The ID of the Subject to be deleted.
 * @returns {Object} - The deleted Subject object.
 */
exports.deleteSubjectService = async (id) => {
  return await Subject.findByIdAndDelete(id);
};
