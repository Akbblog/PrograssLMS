const AssignmentService = require('../../services/academic/assignment.service');

exports.createAssignment = AssignmentService.createAssignment;
exports.getAssignments = AssignmentService.getAssignments;
exports.submitAssignment = AssignmentService.submitAssignment;
exports.gradeSubmission = AssignmentService.gradeSubmission;
