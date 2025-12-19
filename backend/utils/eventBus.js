const EventEmitter = require('events');
require('colors');

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.isInitialized = false;
    }

    /**
     * Dispatch an event with data.
     * In a production serverless environment, this could be replaced 
     * with a call to AWS EventBridge, SNS, or a Redis Pub/Sub.
     * @param {string} eventName 
     * @param {any} data 
     */
    async dispatch(eventName, data) {
        console.log(`[EventBus] Dispatching event: ${eventName}`.cyan);

        // Emit locally
        this.emit(eventName, data);

        // We could also trigger cloud events here if needed
        // await cloudEventProvider.publish(eventName, data);
    }

    /**
     * Initialize all listeners
     */
    init(listeners = []) {
        if (this.isInitialized) return;

        listeners.forEach(listener => {
            if (typeof listener.register === 'function') {
                listener.register(this);
            }
        });

        this.isInitialized = true;
        console.log('[EventBus] All listeners initialized'.green.bold);
    }
}

// Singleton instance
const eventBus = new EventBus();

module.exports = eventBus;
