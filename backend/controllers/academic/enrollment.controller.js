// Dynamically load service based on USE_PRISMA flag
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const servicePath = usePrisma 
  ? '../../services/academic/enrollment.service.prisma_impl'
  : '../../services/academic/enrollment.service';

const EnrollmentService = require(servicePath);

exports.createEnrollment = EnrollmentService.createEnrollment;
exports.getStudentEnrollments = EnrollmentService.getStudentEnrollments;
exports.updateEnrollmentProgress = EnrollmentService.updateEnrollmentProgress;
