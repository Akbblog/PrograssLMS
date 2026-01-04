const router = require('express').Router();

// Import all routers
const academicYearRouter = require('./academic/academicYear.router');
const academicTermRouter = require('./academic/academicTerm.router');
const classRouter = require('./academic/class.router');
const subjectRouter = require('./academic/subject.router');
const programRouter = require('./academic/program.router');
const courseRouter = require('./academic/course.router');
const questionRouter = require('./academic/question.router');
const gradingPolicyRouter = require('./academic/gradingPolicy.router');
const assessmentTypeRouter = require('./academic/assessmentType.router');
const attendanceRouter = require('./academic/attendance.router');
const attendanceBehaviorRouter = require('./academic/attendanceBehavior.router');
const teacherAttendanceRouter = require('./academic/teacherAttendance.router');
const resultsRouter = require('./academic/results.router');
const examsRouter = require('./academic/exams.router');
const enrollmentRouter = require('./academic/enrollment.router');
const gradeRouter = require('./academic/grade.router');
const performanceRouter = require('./academic/performance.router');
const assignmentRouter = require('./academic/assignment.router');
const yearGroupRouter = require('./academic/yearGroup.router');

// Finance
const feeRouter = require('./finance/fee.router');
const financeRouter = require('./finance/finance.router');

// Staff
const adminRouter = require('./staff/admin.router');
const teacherRouter = require('./staff/teachers.router');
const roleRouter = require('./staff/role.router');

// Students
const studentsRouter = require('./students/students.router');

// Communication
const chatRouter = require('./communication/chat.router');
const notificationsRouter = require('./communication/notifications.router');

// Library
const libraryRouter = require('./library/library.router');

// Transport
const transportRouter = require('./transport/transport.router');

// Attendance (QR)
const attendanceQRRouter = require('./attendance/attendance.router');

// HR
const hrRouter = require('./hr/hr.router');

// Documents
const documentsRouter = require('./documents/documents.router');

// Superadmin
const schoolRouter = require('./superadmin/school.router');

// Contact
const contactRouter = require('./contact.router');

// Register ALL routes
// Academic - mounted at root since they define their own paths
router.use('/', academicYearRouter);
router.use('/', academicTermRouter);
router.use('/', classRouter);
router.use('/', subjectRouter);
router.use('/', programRouter);
router.use('/', courseRouter);
router.use('/', questionRouter);
router.use('/', gradingPolicyRouter);
router.use('/', assessmentTypeRouter);
router.use('/', attendanceRouter);
router.use('/academic/behavior', attendanceBehaviorRouter);
router.use('/', teacherAttendanceRouter);
router.use('/', resultsRouter);
router.use('/', examsRouter);
router.use('/', enrollmentRouter);
router.use('/', gradeRouter);
router.use('/', performanceRouter);
router.use('/', assignmentRouter);
router.use('/', yearGroupRouter);

// Finance
router.use('/finance', financeRouter);
router.use('/', feeRouter); // fee router defines /fees/... so mount at root

// Staff
router.use('/', adminRouter);
router.use('/', teacherRouter);
router.use('/', roleRouter);

// Students
router.use('/', studentsRouter);

// Communication
router.use('/', chatRouter); // defines /conversations
router.use('/communication/notifications', notificationsRouter);

// Library
router.use('/library', libraryRouter);

// Transport
router.use('/transport', transportRouter);

// Attendance (QR)
router.use('/attendance', attendanceQRRouter);

// HR
router.use('/hr', hrRouter);

// Documents
router.use('/documents', documentsRouter);

// Superadmin
router.use('/superadmin', schoolRouter);

// Contact
router.use('/contact', contactRouter);

module.exports = router;