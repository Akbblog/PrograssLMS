const router = require('express').Router();

/**
 * Safely require a router with error handling
 * @param {string} path - Router path
 * @param {string} mountPath - Mount path for the router
 */
const safeRequire = (path, mountPath) => {
  try {
    const routerModule = require(path);
    if (mountPath === '/') {
        router.use(routerModule);
    } else {
        router.use(mountPath, routerModule);
    }
    console.log(`[ROUTES] ✅ Mounted: ${mountPath || '/'}`);
  } catch (e) {
    console.error(`[ROUTES] ❌ Failed to load ${path}: ${e.message}`);
    // Create placeholder that returns 503
    if (mountPath && mountPath !== '/') {
        router.use(mountPath, (req, res) => {
            res.status(503).json({ 
                message: `Service ${mountPath} temporarily unavailable`,
                error: e.message 
            });
        });
    }
  }
};

// ============ ACADEMIC ROUTES ============
safeRequire('./academic/academicYear.router', '/');
safeRequire('./academic/academicTerm.router', '/');
safeRequire('./academic/class.router', '/');
safeRequire('./academic/subject.router', '/');
safeRequire('./academic/program.router', '/');
safeRequire('./academic/course.router', '/');
safeRequire('./academic/question.router', '/');
safeRequire('./academic/gradingPolicy.router', '/');
safeRequire('./academic/assessmentType.router', '/');
safeRequire('./academic/attendance.router', '/');
safeRequire('./academic/attendanceBehavior.router', '/academic/behavior');
safeRequire('./academic/teacherAttendance.router', '/');
safeRequire('./academic/results.router', '/');
safeRequire('./academic/exams.router', '/');
safeRequire('./academic/enrollment.router', '/');
safeRequire('./academic/grade.router', '/');
safeRequire('./academic/performance.router', '/');
safeRequire('./academic/assignment.router', '/');
safeRequire('./academic/yearGroup.router', '/');

// ============ FINANCE ROUTES ============
safeRequire('./finance/finance.router', '/finance');
safeRequire('./finance/fee.router', '/');

// ============ STAFF ROUTES ============
safeRequire('./staff/admin.router', '/');
safeRequire('./staff/teachers.router', '/');
safeRequire('./staff/role.router', '/');

// ============ STUDENT ROUTES ============
safeRequire('./students/students.router', '/');

// ============ COMMUNICATION ROUTES ============
safeRequire('./communication/chat.router', '/');
safeRequire('./communication/notifications.router', '/communication/notifications');

// ============ LIBRARY ROUTES ============
safeRequire('./library/library.router', '/library');

// ============ TRANSPORT ROUTES ============
safeRequire('./transport/transport.router', '/transport');

// ============ ATTENDANCE (QR) ROUTES ============
safeRequire('./attendance/attendance.router', '/attendance');

// ============ HR ROUTES ============
safeRequire('./hr/hr.router', '/hr');

// ============ DOCUMENT ROUTES ============
safeRequire('./documents/documents.router', '/documents');

// ============ SUPERADMIN ROUTES ============
safeRequire('./superadmin/school.router', '/superadmin');

// ============ CONTACT ROUTES ============
safeRequire('./contact.router', '/contact');

console.log('[ROUTES] Route initialization complete');
module.exports = router;