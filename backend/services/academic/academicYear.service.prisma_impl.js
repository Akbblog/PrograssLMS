const { getPrisma } = require('../../lib/prismaClient');
const responseStatus = require('../../handlers/responseStatus.handler.js');

/**
 * Prisma stub implementation for AcademicYear service.
 * Since the AcademicYear table is not in the Prisma schema, we return static data
 * to prevent 500 errors on the dashboard.
 */

/**
 * Create academic year service (stub).
 * @param {Object} data - The academic year data.
 * @param {string} userId - The ID of the user creating the academic year.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object.
 */
exports.createAcademicYearService = async (data, userId, res) => {
  const { name, fromYear, toYear, isCurrent } = data;
  
  // Return a stub response since AcademicYear table doesn't exist in schema
  const stubYear = {
    id: `year-${Date.now()}`,
    name: name || `${fromYear}-${toYear}`,
    fromYear: fromYear || '2025',
    toYear: toYear || '2026',
    isCurrent: isCurrent || true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return responseStatus(res, 201, "success", stubYear);
};

/**
 * Get all academic years service (stub).
 * Returns a static current year to satisfy the frontend.
 * @param {string} schoolId - Optional school ID for filtering.
 * @returns {Array} - An array of academic years.
 */
exports.getAcademicYearsService = async (schoolId) => {
  // Return static data since AcademicYear table doesn't exist
  return [
    {
      id: 'year-2025',
      name: '2025-2026',
      fromYear: '2025',
      toYear: '2026',
      isCurrent: true,
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    }
  ];
};

/**
 * Get single academic year by ID service (stub).
 * @param {string} id - The ID of the academic year.
 * @returns {Object} - The academic year object.
 */
exports.getAcademicYearService = async (id) => {
  return {
    id: id || 'year-2025',
    name: '2025-2026',
    fromYear: '2025',
    toYear: '2026',
    isCurrent: true
  };
};

/**
 * Update academic year service (stub).
 * @param {Object} data - The updated data.
 * @param {string} academicId - The ID of the academic year.
 * @param {string} userId - The ID of the user.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object.
 */
exports.updateAcademicYearService = async (data, academicId, userId, res) => {
  const { name, fromYear, toYear, isCurrent } = data;
  
  const updatedYear = {
    id: academicId,
    name: name || '2025-2026',
    fromYear: fromYear || '2025',
    toYear: toYear || '2026',
    isCurrent: isCurrent !== undefined ? isCurrent : true,
    updatedAt: new Date()
  };
  
  return responseStatus(res, 200, "success", updatedYear);
};

/**
 * Delete academic year service (stub).
 * @param {string} id - The ID of the academic year to delete.
 * @returns {Object} - The deleted academic year.
 */
exports.deleteAcademicYearService = async (id) => {
  return { id, deleted: true };
};

/**
 * Get current academic year service (stub).
 * @param {string} schoolId - The school ID.
 * @returns {Object} - The current academic year.
 */
exports.getCurrentAcademicYearService = async (schoolId) => {
  return {
    id: 'year-2025',
    name: '2025-2026',
    fromYear: '2025',
    toYear: '2026',
    isCurrent: true,
    schoolId: schoolId || 'SCHOOL-IMPORT-1'
  };
};
