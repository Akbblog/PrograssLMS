const mongoose = require('mongoose');

console.log('Starting load test for School model and Students service...');

try {
    console.log('Loading School.model...');
    require('../models/School.model.js');
    console.log('✅ School.model loaded');
} catch (e) {
    console.error('❌ Failed to load School.model:', e);
}

try {
    console.log('Loading students.service...');
    require('../services/students/students.service.js');
    console.log('✅ students.service loaded');
} catch (e) {
    console.error('❌ Failed to load students.service:', e);
}

console.log('Load test complete.');
