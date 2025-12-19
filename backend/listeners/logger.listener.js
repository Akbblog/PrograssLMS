require('colors');
/**
 * System Logger Listener
 * Observes all events and logs them for auditing or analytics
 */
const LoggerListener = {
    register: (eventBus) => {
        // We can listen to specific patterns if we had a more complex bus,
        // but for now we'll just subscribe to some key events.

        const eventsToLog = [
            'admin.registered',
            'admin.login',
            'student.registered',
            'student.exam_completed',
            'school.created'
        ];

        eventsToLog.forEach(eventName => {
            eventBus.on(eventName, (data) => {
                const timestamp = new Date().toISOString();
                console.log(`[AUDIT] ${timestamp} - Event: ${eventName} - Data: ${JSON.stringify(data).substring(0, 100)}...`.magenta);

                // In a real system, you might write this to an AuditLog collection
                // AuditLog.create({ event: eventName, data, timestamp });
            });
        });
    }
};

module.exports = LoggerListener;
