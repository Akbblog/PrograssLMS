// Import necessary models
const AcademicYear = require("../../models/Academic/academicYear.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Create academic years service.
 *
 * @param {Object} data - The data containing information about the academic year.
 * @param {string} data.name - The name of the academic year.
 * @param {string} data.fromYear - The starting year of the academic year.
 * @param {string} data.toYear - The ending year of the academic year.
 * @param {string} userId - The ID of the user creating the academic year.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createAcademicYearService = async (data, userId, res) => {
  const { name, fromYear, toYear, isCurrent } = data;

  // Get the admin to find their schoolId
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 401, "failed", "Admin not found");
  }

  const schoolId = admin.schoolId;
  if (!schoolId) {
    return responseStatus(res, 400, "failed", "No school associated with this admin");
  }

  // Check if the academic year already exists for this school
  const academicYear = await AcademicYear.findOne({ name, schoolId });
  if (academicYear) {
    return responseStatus(res, 400, "failed", "Academic year already exists");
  }

  // If setting as current, unset any existing current year for this school
  if (isCurrent) {
    await AcademicYear.updateMany({ schoolId }, { isCurrent: false });
  }

  // Create the academic year with schoolId
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    isCurrent: isCurrent || false,
    schoolId,
    createdBy: userId,
  });

  // Push the academic year into the admin's academicYears array
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();

  // Send the response
  return responseStatus(res, 201, "success", academicYearCreated);
};

/**
 * Get all academic years service.
 *
 * @param {string} schoolId - Optional school ID for filtering.
 * @returns {Array} - An array of all academic years.
 */
exports.getAcademicYearsService = async (schoolId) => {
  const filter = schoolId ? { schoolId } : {};
  return await AcademicYear.find(filter).sort({ createdAt: -1 });
};

/**
 * Get academic year by ID service.
 *
 * @param {string} id - The ID of the academic year.
 * @returns {Object} - The academic year object.
 */
exports.getAcademicYearService = async (id) => {
  return await AcademicYear.findById(id);
};

/**
 * Update academic year service.
 *
 * @param {Object} data - The data containing updated information about the academic year.
 * @param {string} data.name - The updated name of the academic year.
 * @param {string} data.fromYear - The updated starting year of the academic year.
 * @param {string} data.toYear - The updated ending year of the academic year.
 * @param {string} academicId - The ID of the academic year to be updated.
 * @param {string} userId - The ID of the user updating the academic year.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateAcademicYearService = async (data, academicId, userId, res) => {
  const { name, fromYear, toYear, isCurrent } = data;

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
  const existingYear = await AcademicYear.findOne({ name, schoolId, _id: { $ne: academicId } });
  if (existingYear) {
    return responseStatus(res, 400, "failed", "Academic year name already exists");
  }

  // If setting as current, unset any existing current year for this school
  if (isCurrent) {
    await AcademicYear.updateMany({ schoolId, _id: { $ne: academicId } }, { isCurrent: false });
  }

  // Update the academic year
  const academicYear = await AcademicYear.findByIdAndUpdate(
    academicId,
    { name, fromYear, toYear, isCurrent, createdBy: userId },
    { new: true }
  );

  // Send the response
  return responseStatus(res, 200, "success", academicYear);
};

/**
 * Delete academic year service.
 *
 * @param {string} id - The ID of the academic year to be deleted.
 * @returns {Object} - The deleted academic year object.
 */
exports.deleteAcademicYearService = async (id) => {
  return await AcademicYear.findByIdAndDelete(id);
};
