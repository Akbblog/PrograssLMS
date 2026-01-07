// Import necessary models
const AcademicTerm = require("../../models/Academic/academicTerm.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Create academic terms service.
 *
 * @param {Object} data - The data containing information about the academic term.
 * @param {string} data.name - The name of the academic term.
 * @param {string} data.description - The description of the academic term.
 * @param {string} data.duration - The duration of the academic term.
 * @param {string} userId - The ID of the user creating the academic term.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createAcademicTermService = async (data, userId, res) => {
  const { name, description, duration, isCurrent } = data;

  // Get the admin to find their schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if the academic term already exists for this school
  const academicTerm = await AcademicTerm.findOne({ name, schoolId });
  if (academicTerm) {
    return responseStatus(res, 400, "failed", "Academic term already exists");
  }

  // If setting as current, unset any existing current term for this school
  if (isCurrent) {
    await AcademicTerm.updateMany({ schoolId }, { isCurrent: false });
  }

  // Create the academic term with schoolId
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    isCurrent: isCurrent || false,
    schoolId,
    createdBy: userId,
  });

  // Push the academic term into the admin's academicTerms array
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();

  // Send the response
  return responseStatus(res, 201, "success", academicTermCreated);
};

/**
 * Get all academic terms service.
 *
 * @param {string} schoolId - Optional school ID for filtering.
 * @returns {Array} - An array of all academic terms.
 */
exports.getAcademicTermsService = async (schoolId) => {
  const filter = schoolId ? { schoolId } : {};
  return await AcademicTerm.find(filter)
    .select('name description duration isCurrent')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get academic term by ID service.
 *
 * @param {string} id - The ID of the academic term.
 * @returns {Object} - The academic term object.
 */
exports.getAcademicTermService = async (id) => {
  return await AcademicTerm.findById(id).select('name description duration isCurrent').lean();
};

/**
 * Update academic term service.
 *
 * @param {Object} data - The data containing updated information about the academic term.
 * @param {string} data.name - The updated name of the academic term.
 * @param {string} data.description - The updated description of the academic term.
 * @param {string} data.duration - The updated duration of the academic term.
 * @param {string} academicId - The ID of the academic term to be updated.
 * @param {string} userId - The ID of the user updating the academic term.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateAcademicTermService = async (data, academicId, userId, res) => {
  const { name, description, duration, isCurrent } = data;

  // Get the admin to find their schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if the updated name already exists for this school (but not for this record)
  const existingTerm = await AcademicTerm.findOne({ name, schoolId, _id: { $ne: academicId } });
  if (existingTerm) {
    return responseStatus(res, 400, "failed", "Academic term name already exists");
  }

  // If setting as current, unset any existing current term for this school
  if (isCurrent) {
    await AcademicTerm.updateMany({ schoolId, _id: { $ne: academicId } }, { isCurrent: false });
  }

  // Update the academic term
  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    academicId,
    { name, description, duration, isCurrent, createdBy: userId },
    { new: true }
  );

  // Send the response
  return responseStatus(res, 200, "success", academicTerm);
};

/**
 * Delete academic term service.
 *
 * @param {string} id - The ID of the academic term to be deleted.
 * @returns {Object} - The deleted academic term object.
 */
exports.deleteAcademicTermService = async (id) => {
  return await AcademicTerm.findByIdAndDelete(id);
};
