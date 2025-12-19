const EVENTS = require('../utils/events');
require('colors');

/**
 * School Event Listener
 */
const SchoolListener = {
    register: (eventBus) => {
        // Listen for school creation
        eventBus.on(EVENTS.SCHOOL.CREATED, async (school) => {
            console.log(`[SchoolListener] Handling ${EVENTS.SCHOOL.CREATED} for "${school.name}"`.blue);
            try {
                // Example: We could automatically create a default Academic Year or Term for the new school
                console.log(`Setting up default environment for school: ${school._id}...`.gray);

                // const AcademicYear = require('../models/Academic/academicYear.model');
                // await AcademicYear.create({ name: '2023-2024', schoolId: school._id, ... });
            } catch (error) {
                console.error(`Error in ${EVENTS.SCHOOL.CREATED} handler:`, error);
            }
        });
    }
};

module.exports = SchoolListener;
