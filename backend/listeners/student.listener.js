const EVENTS = require('../utils/events');
require('colors');

/**
 * Student Event Listener
 */
const StudentListener = {
    register: (eventBus) => {
        // Listen for student registration
        eventBus.on(EVENTS.STUDENT.REGISTERED, async (student) => {
            console.log(`[StudentListener] Handling ${EVENTS.STUDENT.REGISTERED}`.blue);
            try {
                // Example: Create default enrollment or send notification
                console.log(`Processing student registration for ${student.name}...`.gray);
            } catch (error) {
                console.error(`Error in ${EVENTS.STUDENT.REGISTERED} handler:`, error);
            }
        });

        // Listen for enrollment
        eventBus.on(EVENTS.STUDENT.ENROLLED, async (data) => {
            console.log(`[StudentListener] Student ${data.studentId} enrolled in ${data.courseId}`.blue);
        });
    }
};

module.exports = StudentListener;
