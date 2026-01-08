const responseStatus = require('../../handlers/responseStatus.handler.js');

/**
 * Prisma stub implementation for AcademicTerm service.
 * Since the AcademicTerm table is not in the Prisma schema, we return static data
 * to prevent 500 errors on the dashboard.
 */

/**
 * Create academic term service (stub).
 * @param {Object} data - The academic term data.
 * @param {string} userId - The ID of the user creating the term.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object.
 */
exports.createAcademicTermService = async (data, userId, res) => {
  const { name, description, duration } = data;
  
  const stubTerm = {
    id: `term-${Date.now()}`,
    name: name || 'Term 1',
    description: description || 'First Term',
    duration: duration || '3 months',
    isCurrent: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return responseStatus(res, 201, "success", stubTerm);
};

/**
 * Get all academic terms service (stub).
 * Returns static terms to satisfy the frontend.
 * @param {string} schoolId - Optional school ID for filtering.
 * @returns {Array} - An array of academic terms.
 */
exports.getAcademicTermsService = async (schoolId) => {
  return [
    {
      id: 'term-1',
      name: 'Term 1',
      description: 'First Term 2025-2026',
      duration: '3 months',
      isCurrent: true,
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    },
    {
      id: 'term-2',
      name: 'Term 2',
      description: 'Second Term 2025-2026',
      duration: '3 months',
      isCurrent: false,
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    },
    {
      id: 'term-3',
      name: 'Term 3',
      description: 'Third Term 2025-2026',
      duration: '3 months',
      isCurrent: false,
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    }
  ];
};

/**
 * Get single academic term by ID service (stub).
 * @param {string} id - The ID of the academic term.
 * @returns {Object} - The academic term object.
 */
exports.getAcademicTermService = async (id) => {
  return {
    id: id || 'term-1',
    name: 'Term 1',
    description: 'First Term 2025-2026',
    duration: '3 months',
    isCurrent: true
  };
};

/**
 * Update academic term service (stub).
 * @param {Object} data - The updated data.
 * @param {string} termId - The ID of the academic term.
 * @param {string} userId - The ID of the user.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response object.
 */
exports.updateAcademicTermService = async (data, termId, userId, res) => {
  const { name, description, duration, isCurrent } = data;
  
  const updatedTerm = {
    id: termId,
    name: name || 'Term 1',
    description: description || 'First Term 2025-2026',
    duration: duration || '3 months',
    isCurrent: isCurrent !== undefined ? isCurrent : true,
    updatedAt: new Date()
  };
  
  return responseStatus(res, 200, "success", updatedTerm);
};

/**
 * Delete academic term service (stub).
 * @param {string} id - The ID of the academic term to delete.
 * @returns {Object} - The deleted academic term.
 */
exports.deleteAcademicTermService = async (id) => {
  return { id, deleted: true };
};

/**
 * Get current academic term service (stub).
 * @param {string} schoolId - The school ID.
 * @returns {Object} - The current academic term.
 */
exports.getCurrentAcademicTermService = async (schoolId) => {
  return {
    id: 'term-1',
    name: 'Term 1',
    description: 'First Term 2025-2026',
    duration: '3 months',
    isCurrent: true,
    schoolId: schoolId || 'SCHOOL-IMPORT-1'
  };
};
