const mongoose = require('mongoose');
const path = require('path');

console.log('Starting load test...');

try {
    console.log('Loading students.model...');
    require('../models/Students/students.model');
    console.log('✅ students.model loaded');
} catch (e) {
    console.error('❌ Failed to load students.model:', e);
}

try {
    console.log('Loading Attendance.model...');
    require('../models/Academic/Attendance.model');
    console.log('✅ Attendance.model loaded');
} catch (e) {
    console.error('❌ Failed to load Attendance.model:', e);
}

try {
    console.log('Loading BehaviorIncident.model...');
    require('../models/Academic/BehaviorIncident.model');
    console.log('✅ BehaviorIncident.model loaded');
} catch (e) {
    console.error('❌ Failed to load BehaviorIncident.model:', e);
}

try {
    console.log('Loading attendanceBehavior.service...');
    require('../services/academic/attendanceBehavior.service');
    console.log('✅ attendanceBehavior.service loaded');
} catch (e) {
    console.error('❌ Failed to load attendanceBehavior.service:', e);
}

try {
    console.log('Loading attendanceBehavior.controller...');
    require('../controllers/academic/attendanceBehavior.controller');
    console.log('✅ attendanceBehavior.controller loaded');
} catch (e) {
    console.error('❌ Failed to load attendanceBehavior.controller:', e);
}

try {
    console.log('Loading attendanceBehavior.router...');
    require('../routes/v1/academic/attendanceBehavior.router');
    console.log('✅ attendanceBehavior.router loaded');
} catch (e) {
    console.error('❌ Failed to load attendanceBehavior.router:', e);
}

console.log('Load test complete.');
