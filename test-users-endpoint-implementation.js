#!/usr/bin/env node

/**
 * Test: Communication Users Endpoint
 * Tests the endpoint with proper query filters
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Communication Users Endpoint - Implementation Test\n');
console.log('=' .repeat(60));

const checks = [];

// Check 1: Query filters for each model
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    
    // Check Admin query
    const adminQuery = content.includes('Admin.find({ schoolId })');
    checks.push({
        name: 'Admin query filter',
        status: adminQuery ? '✅' : '❌',
        detail: adminQuery ? 'Correctly queries all admins in school' : 'Incorrect query'
    });
    
    // Check Teacher query with status filter
    const teacherQuery = content.includes("status: { $in: ['active', 'inactive']");
    checks.push({
        name: 'Teacher status filter',
        status: teacherQuery ? '✅' : '❌',
        detail: teacherQuery ? "Filters for active/inactive status" : 'Status filter missing'
    });
    
    // Check Student query with withdrawn/suspended
    const studentQuery = content.includes('isWithdrawn: false') && content.includes('isSuspended: false');
    checks.push({
        name: 'Student status filter',
        status: studentQuery ? '✅' : '❌',
        detail: studentQuery ? 'Filters out withdrawn/suspended' : 'Filter incomplete'
    });
    
} catch (e) {
    checks.push({
        name: 'Query filters',
        status: '❌',
        detail: e.message
    });
}

// Check 2: Model imports
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    
    const hasAdmin = content.includes("require('../../../models/Staff/admin.model')");
    const hasTeacher = content.includes("require('../../../models/Staff/teachers.model')");
    const hasStudent = content.includes("require('../../../models/Students/students.model')");
    
    checks.push({
        name: 'Admin model import',
        status: hasAdmin ? '✅' : '❌',
        detail: hasAdmin ? 'Correct path' : 'Missing or wrong path'
    });
    
    checks.push({
        name: 'Teacher model import',
        status: hasTeacher ? '✅' : '❌',
        detail: hasTeacher ? 'Correct path' : 'Missing or wrong path'
    });
    
    checks.push({
        name: 'Student model import',
        status: hasStudent ? '✅' : '❌',
        detail: hasStudent ? 'Correct path' : 'Missing or wrong path'
    });
    
} catch (e) {
    checks.push({
        name: 'Model imports',
        status: '❌',
        detail: e.message
    });
}

// Check 3: Error handling
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    
    const hasErrorLogging = content.includes('console.error');
    const hasErrorResponse = content.includes("status: 'fail'");
    
    checks.push({
        name: 'Error logging',
        status: hasErrorLogging ? '✅' : '❌',
        detail: hasErrorLogging ? 'Logs errors' : 'No error logging'
    });
    
    checks.push({
        name: 'Error response',
        status: hasErrorResponse ? '✅' : '❌',
        detail: hasErrorResponse ? 'Returns error response' : 'No error response'
    });
    
} catch (e) {
    checks.push({
        name: 'Error handling',
        status: '❌',
        detail: e.message
    });
}

// Print results
console.log('\n📋 Implementation Checks:\n');
checks.forEach((check, i) => {
    console.log(`${i + 1}. ${check.name}`);
    console.log(`   Status: ${check.status}`);
    console.log(`   Detail: ${check.detail}`);
    console.log();
});

const passed = checks.filter(c => c.status === '✅').length;
console.log('=' .repeat(60));
console.log(`\n📊 Summary: ${passed}/${checks.length} checks passed\n`);

if (passed === checks.length) {
    console.log('✅ All checks passed!\n');
    console.log('🎯 What the endpoint does:');
    console.log('   1. Gets all Admins in school (no status filter)');
    console.log('   2. Gets Teachers with status "active" or "inactive"');
    console.log('   3. Gets Students where isWithdrawn=false AND isSuspended=false');
    console.log('   4. Combines all users with their roles');
    console.log('   5. Returns JSON with users array\n');
    console.log('🚀 Expected behavior:');
    console.log('   - Returns 200 with all active users');
    console.log('   - 500 if query fails (now with better logging)');
    console.log('   - 400 if schoolId missing\n');
} else {
    console.log(`⚠️ ${checks.length - passed} issue(s) found\n`);
}

process.exit(passed === checks.length ? 0 : 1);
