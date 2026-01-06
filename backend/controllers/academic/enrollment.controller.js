const EnrollmentService = require('../../services/academic/enrollment.service');

exports.createEnrollment = EnrollmentService.createEnrollment;
exports.getStudentEnrollments = EnrollmentService.getStudentEnrollments;
exports.updateEnrollmentProgress = EnrollmentService.updateEnrollmentProgress;
