// Import necessary models
const Program = require("../../models/Academic/program.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Create program service.
 *
 * @param {Object} data - The data containing information about the program.
 * @param {string} data.name - The name of the program.
 * @param {string} data.description - The description of the program.
 * @param {string} userId - The ID of the user creating the program.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createProgramService = async (data, userId, res) => {
  const { name, description, duration } = data;

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

  // Check if the program already exists for this school
  const programFound = await Program.findOne({ name, schoolId });
  if (programFound) {
    return responseStatus(res, 400, "failed", "Program already exists");
  }

  // Create the program with schoolId
  const programCreated = await Program.create({
    name,
    description,
    duration,
    createdBy: userId,
    schoolId: schoolId,
  });

  // Push the program into the admin's programs array
  admin.programs.push(programCreated._id);
  await admin.save();

  // Send the response
  return responseStatus(res, 201, "success", programCreated);
};

/**
 * Get all programs service.
 *
 * @param {string} schoolId - Optional school ID for multi-tenancy filtering
 * @returns {Array} - An array of all programs.
 */
exports.getAllProgramsService = async (schoolId) => {
  const filter = schoolId ? { schoolId } : {};
  return await Program.find(filter).populate('createdBy', 'name email');
};

/**
 * Get a single program by ID service.
 *
 * @param {string} id - The ID of the program.
 * @returns {Object} - The program object.
 */
exports.getProgramsService = async (id) => {
  return await Program.findById(id);
};

/**
 * Update program data service.
 *
 * @param {Object} data - The data containing updated information about the program.
 * @param {string} data.name - The updated name of the program.
 * @param {string} data.description - The updated description of the program.
 * @param {string} id - The ID of the program to be updated.
 * @param {string} userId - The ID of the user updating the program.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateProgramService = async (data, id, userId, res) => {
  const { name, description, duration } = data;

  // Check if the updated name already exists (but not for this program)
  const existingProgram = await Program.findOne({ name, _id: { $ne: id } });
  if (existingProgram) {
    return responseStatus(res, 400, "failed", "Program name already exists");
  }

  // Update the program
  const program = await Program.findByIdAndUpdate(
    id,
    {
      name,
      description,
      duration,
      createdBy: userId,
    },
    {
      new: true,
    }
  );

  // Send the response
  return responseStatus(res, 200, "success", program);
};

/**
 * Delete program data service.
 *
 * @param {string} id - The ID of the program to be deleted.
 * @returns {Object} - The deleted program object.
 */
exports.deleteProgramService = async (id) => {
  return await Program.findByIdAndDelete(id);
};
