const responseStatus = require('../../handlers/responseStatus.handler.js');

/**
 * Prisma stub implementation for Program service.
 * Since the Program table is not in the Prisma schema, we return static data
 * to prevent 500 errors on the dashboard.
 */

/**
 * Create program service (stub).
 */
exports.createProgramService = async (data, userId, res) => {
  const { name, description, duration } = data;
  
  const stubProgram = {
    id: `program-${Date.now()}`,
    name: name || 'General Education',
    description: description || 'Standard educational program',
    duration: duration || '1 year',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return responseStatus(res, 201, "success", stubProgram);
};

/**
 * Get all programs service (stub).
 */
exports.getAllProgramsService = async (schoolId) => {
  return [
    {
      id: 'program-1',
      name: 'Primary Education',
      description: 'Primary school program (Grades 1-5)',
      duration: '5 years',
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    },
    {
      id: 'program-2',
      name: 'Middle School',
      description: 'Middle school program (Grades 6-8)',
      duration: '3 years',
      schoolId: schoolId || 'SCHOOL-IMPORT-1'
    }
  ];
};

/**
 * Get single program by ID service (stub).
 */
exports.getProgramsService = async (id) => {
  return {
    id: id || 'program-1',
    name: 'Primary Education',
    description: 'Primary school program',
    duration: '5 years'
  };
};

/**
 * Update program service (stub).
 */
exports.updateProgramService = async (data, programId, userId, res) => {
  const { name, description, duration } = data;
  
  const updatedProgram = {
    id: programId,
    name: name || 'Primary Education',
    description: description || 'Primary school program',
    duration: duration || '5 years',
    updatedAt: new Date()
  };
  
  return responseStatus(res, 200, "success", updatedProgram);
};

/**
 * Delete program service (stub).
 */
exports.deleteProgramService = async (id) => {
  return { id, deleted: true };
};
