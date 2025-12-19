const EVENTS = require('../utils/events');
require('colors');

/**
 * Admin Event Listener
 */
const AdminListener = {
    register: (eventBus) => {
        // Listen for admin registration
        eventBus.on(EVENTS.ADMIN.REGISTERED, async (admin) => {
            console.log(`[AdminListener] Handling ${EVENTS.ADMIN.REGISTERED}`.blue);
            try {
                // Example: Send welcome email (mocked)
                console.log(`Sending welcome email to ${admin.email}...`.gray);
                // await emailService.sendWelcome(admin);
            } catch (error) {
                console.error(`Error in ${EVENTS.ADMIN.REGISTERED} handler:`, error);
            }
        });

        // Listen for admin login
        eventBus.on(EVENTS.ADMIN.LOGIN, async (user) => {
            console.log(`[AdminListener] Handling ${EVENTS.ADMIN.LOGIN} for ${user.email}`.blue);
            // Example: Log login activity to a separate log database or analytics service
        });
    }
};

module.exports = AdminListener;
