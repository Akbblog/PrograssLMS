/**
 * Centralized event names for the application
 */
const EVENTS = {
    // Admin Events
    ADMIN: {
        REGISTERED: 'admin.registered',
        UPDATED: 'admin.updated',
        LOGIN: 'admin.login',
    },

    // School Events
    SCHOOL: {
        CREATED: 'school.created',
        UPDATED: 'school.updated',
        DELETED: 'school.deleted',
    },

    // Teacher Events
    TEACHER: {
        CREATED: 'teacher.created',
        ASSIGNED_TO_CLASS: 'teacher.assigned_to_class',
    },

    // Student Events
    STUDENT: {
        REGISTERED: 'student.registered',
        ENROLLED: 'student.enrolled',
        EXAM_COMPLETED: 'student.exam_completed',
    },

    // Academic Events
    ACADEMIC: {
        EXAM_CREATED: 'academic.exam_created',
        GRADE_PUBLISHED: 'academic.grade_published',
        ASSIGNMENT_CREATED: 'academic.assignment_created',
    }
};

module.exports = EVENTS;
