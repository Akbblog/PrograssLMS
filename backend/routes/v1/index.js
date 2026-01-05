const router = require('express').Router();

// Store route loading errors for debugging
const routeErrors = [];

// NOTE: Avoid dynamic `require(pathVar)` in serverless.
// Vercel’s bundler may not include those files, causing runtime 503s.

// Debug endpoints
router.get('/debug/errors', (req, res) => {
    res.json({
        status: 'success',
        errors: routeErrors
    });
});

router.get('/debug/routes', (req, res) => {
    const routes = [];
    
    // Helper to extract routes from stack
    const extractRoutes = (stack, prefix = '') => {
        stack.forEach(layer => {
            if (layer.route) {
                const path = layer.route.path;
                const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
                routes.push({ path: prefix + path, methods });
            } else if (layer.name === 'router' && layer.handle.stack) {
                // This is a mounted router
                // The path is in layer.regexp, but it's a regex. 
                // We can try to guess the prefix from the safeRequire calls or just list it as is.
                // For simplicity, we just recurse.
                // Note: Express doesn't easily expose the mount path of a router middleware in the stack.
                extractRoutes(layer.handle.stack, prefix);
            }
        });
    };

    extractRoutes(router.stack);
    res.json({ count: routes.length, routes });
});

// ============ ACADEMIC ROUTES ============
// Explicitly require critical routes to ensure they load
try {
    router.use('/', require('./academic/academicYear.router'));
    console.log('[ROUTES] ✅ Mounted: /academic-years (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load academicYear.router:', e);
    routeErrors.push({ path: './academic/academicYear.router', error: e.message });
}

try {
    router.use('/', require('./academic/academicTerm.router'));
    console.log('[ROUTES] ✅ Mounted: /academic-term (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load academicTerm.router:', e);
    routeErrors.push({ path: './academic/academicTerm.router', error: e.message });
}

try {
    router.use('/', require('./academic/class.router'));
    console.log('[ROUTES] ✅ Mounted: /class-levels (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load class.router:', e);
    routeErrors.push({ path: './academic/class.router', error: e.message });
}

try {
    router.use('/', require('./academic/teacherAttendance.router'));
    console.log('[ROUTES] ✅ Mounted: /teacher-attendance (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load teacherAttendance.router:', e);
    routeErrors.push({ path: './academic/teacherAttendance.router', error: e.message });
}

try {
    router.use('/', require('./academic/subject.router'));
    console.log('[ROUTES] ✅ Mounted: /subject (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load subject.router:', e);
    routeErrors.push({ path: './academic/subject.router', error: e.message });
}

try {
    router.use('/', require('./academic/program.router'));
    console.log('[ROUTES] ✅ Mounted: /programs (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load program.router:', e);
    routeErrors.push({ path: './academic/program.router', error: e.message });
}

try {
    router.use('/', require('./academic/course.router'));
    console.log('[ROUTES] ✅ Mounted: /courses (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load course.router:', e);
    routeErrors.push({ path: './academic/course.router', error: e.message });
}

try {
    router.use('/', require('./academic/question.router'));
    console.log('[ROUTES] ✅ Mounted: /questions (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load question.router:', e);
    routeErrors.push({ path: './academic/question.router', error: e.message });
}

try {
    router.use('/', require('./academic/gradingPolicy.router'));
    console.log('[ROUTES] ✅ Mounted: /grading-policies (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load gradingPolicy.router:', e);
    routeErrors.push({ path: './academic/gradingPolicy.router', error: e.message });
}

try {
    router.use('/', require('./academic/assessmentType.router'));
    console.log('[ROUTES] ✅ Mounted: /assessment-types (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load assessmentType.router:', e);
    routeErrors.push({ path: './academic/assessmentType.router', error: e.message });
}

try {
    router.use('/', require('./academic/attendance.router'));
    console.log('[ROUTES] ✅ Mounted: /attendance (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load attendance.router:', e);
    routeErrors.push({ path: './academic/attendance.router', error: e.message });
}

try {
    router.use('/academic/behavior', require('./academic/attendanceBehavior.router.js'));
    console.log('[ROUTES] ✅ Mounted: /academic/behavior (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load attendanceBehavior.router:', e);
    routeErrors.push({ path: './academic/attendanceBehavior.router', error: e.message });
    // Mount placeholder for 503
    router.use('/academic/behavior', (req, res) => {
        res.status(503).json({ 
            message: 'Service /academic/behavior temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// safeRequire('./academic/academicYear.router', '/');
// safeRequire('./academic/academicTerm.router', '/');
// safeRequire('./academic/class.router', '/');
// safeRequire('./academic/subject.router', '/');
// safeRequire('./academic/program.router', '/');
// safeRequire('./academic/course.router', '/');
// safeRequire('./academic/question.router', '/');
// safeRequire('./academic/gradingPolicy.router', '/');
// safeRequire('./academic/assessmentType.router', '/');
// safeRequire('./academic/attendance.router', '/');
// safeRequire('./academic/attendanceBehavior.router', '/academic/behavior');
// safeRequire('./academic/teacherAttendance.router', '/');
try {
    router.use('/', require('./academic/results.router'));
    console.log('[ROUTES] ✅ Mounted: /results (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load results.router:', e);
    routeErrors.push({ path: './academic/results.router', error: e.message });
}

try {
    router.use('/', require('./academic/exams.router'));
    console.log('[ROUTES] ✅ Mounted: /exams (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load exams.router:', e);
    routeErrors.push({ path: './academic/exams.router', error: e.message });
}

try {
    router.use('/', require('./academic/enrollment.router'));
    console.log('[ROUTES] ✅ Mounted: /enrollment (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load enrollment.router:', e);
    routeErrors.push({ path: './academic/enrollment.router', error: e.message });
}

try {
    router.use('/', require('./academic/grade.router'));
    console.log('[ROUTES] ✅ Mounted: /grades (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load grade.router:', e);
    routeErrors.push({ path: './academic/grade.router', error: e.message });
}

try {
    router.use('/', require('./academic/performance.router'));
    console.log('[ROUTES] ✅ Mounted: /performance (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load performance.router:', e);
    routeErrors.push({ path: './academic/performance.router', error: e.message });
}

try {
    router.use('/', require('./academic/assignment.router'));
    console.log('[ROUTES] ✅ Mounted: /assignments (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load assignment.router:', e);
    routeErrors.push({ path: './academic/assignment.router', error: e.message });
}

try {
    router.use('/', require('./academic/yearGroup.router'));
    console.log('[ROUTES] ✅ Mounted: /year-groups (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load yearGroup.router:', e);
    routeErrors.push({ path: './academic/yearGroup.router', error: e.message });
}

// ============ FINANCE ROUTES ============
try {
    router.use('/finance', require('./finance/finance.router'));
    console.log('[ROUTES] ✅ Mounted: /finance (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load finance.router:', e);
    routeErrors.push({ path: './finance/finance.router', error: e.message });
}

try {
    router.use('/finance', require('./finance/fee.router'));
    console.log('[ROUTES] ✅ Mounted: /finance/fees (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load fee.router:', e);
    routeErrors.push({ path: './finance/fee.router', error: e.message });
}

// ============ STAFF ROUTES ============
try {
    router.use('/', require('./staff/admin.router'));
    console.log('[ROUTES] ✅ Mounted: /admin (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load admin.router:', e);
    routeErrors.push({ path: './staff/admin.router', error: e.message });
}

try {
    router.use('/', require('./staff/teachers.router'));
    console.log('[ROUTES] ✅ Mounted: /teachers (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load teachers.router:', e);
    routeErrors.push({ path: './staff/teachers.router', error: e.message });
}

try {
    router.use('/', require('./staff/role.router'));
    console.log('[ROUTES] ✅ Mounted: /roles (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load role.router:', e);
    routeErrors.push({ path: './staff/role.router', error: e.message });
}

// ============ STUDENT ROUTES ============
try {
    router.use('/', require('./students/students.router'));
    console.log('[ROUTES] ✅ Mounted: /students (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load students.router:', e);
    routeErrors.push({ path: './students/students.router', error: e.message });
}

// ============ COMMUNICATION ROUTES ============
try {
    router.use('/', require('./communication/chat.router'));
    console.log('[ROUTES] ✅ Mounted: /conversations (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load chat.router:', e);
    routeErrors.push({ path: './communication/chat.router', error: e.message });
}

try {
    router.use('/communication/notifications', require('./communication/notifications.router'));
    console.log('[ROUTES] ✅ Mounted: /communication/notifications (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load notifications.router:', e);
    routeErrors.push({ path: './communication/notifications.router', error: e.message });
}

// ============ LIBRARY ROUTES ============
try {
    router.use('/library', require('./library/library.router'));
    console.log('[ROUTES] ✅ Mounted: /library (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load library.router:', e);
    routeErrors.push({ path: './library/library.router', mountPath: '/library', error: e.message, stack: e.stack });
    router.use('/library', (req, res) => {
        res.status(503).json({
            message: 'Service /library temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ TRANSPORT ROUTES ============
try {
    router.use('/transport', require('./transport/transport.router'));
    console.log('[ROUTES] ✅ Mounted: /transport (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load transport.router:', e);
    routeErrors.push({ path: './transport/transport.router', mountPath: '/transport', error: e.message, stack: e.stack });
    router.use('/transport', (req, res) => {
        res.status(503).json({
            message: 'Service /transport temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ ATTENDANCE (QR) ROUTES ============
try {
    router.use('/attendance', require('./attendance/attendance.router'));
    console.log('[ROUTES] ✅ Mounted: /attendance (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load attendance.router:', e);
    routeErrors.push({ path: './attendance/attendance.router', mountPath: '/attendance', error: e.message, stack: e.stack });
    router.use('/attendance', (req, res) => {
        res.status(503).json({
            message: 'Service /attendance temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ HR ROUTES ============
try {
    router.use('/hr', require('./hr/hr.router'));
    console.log('[ROUTES] ✅ Mounted: /hr (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load hr.router:', e);
    routeErrors.push({ path: './hr/hr.router', mountPath: '/hr', error: e.message, stack: e.stack });
    router.use('/hr', (req, res) => {
        res.status(503).json({
            message: 'Service /hr temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ DOCUMENT ROUTES ============
try {
    router.use('/documents', require('./documents/documents.router'));
    console.log('[ROUTES] ✅ Mounted: /documents (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load documents.router:', e);
    routeErrors.push({ path: './documents/documents.router', mountPath: '/documents', error: e.message, stack: e.stack });
    router.use('/documents', (req, res) => {
        res.status(503).json({
            message: 'Service /documents temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ SUPERADMIN ROUTES ============
try {
    router.use('/superadmin', require('./superadmin/school.router'));
    console.log('[ROUTES] ✅ Mounted: /superadmin (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load superadmin router:', e);
    routeErrors.push({ path: './superadmin/school.router', mountPath: '/superadmin', error: e.message, stack: e.stack });
    router.use('/superadmin', (req, res) => {
        res.status(503).json({
            message: 'Service /superadmin temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

// ============ CONTACT ROUTES ============
try {
    router.use('/contact', require('./contact.router'));
    console.log('[ROUTES] ✅ Mounted: /contact (Explicit)');
} catch (e) {
    console.error('[ROUTES] ❌ Failed to load contact.router:', e);
    routeErrors.push({ path: './contact.router', mountPath: '/contact', error: e.message, stack: e.stack });
    router.use('/contact', (req, res) => {
        res.status(503).json({
            message: 'Service /contact temporarily unavailable',
            error: e.message,
            details: 'Check /api/v1/debug/errors for more info'
        });
    });
}

console.log('[ROUTES] Route initialization complete');
module.exports = router;