// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? '../../services/academic/assignment.service.prisma_impl'
  : '../../services/academic/assignment.service';

const AssignmentService = require(servicePath);

exports.createAssignment = AssignmentService.createAssignment;
exports.getAssignments = AssignmentService.getAssignments;
exports.submitAssignment = AssignmentService.submitAssignment;
exports.gradeSubmission = AssignmentService.gradeSubmission;
