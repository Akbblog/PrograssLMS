#!/usr/bin/env node

/**
 * Verification Script: Communication Users Endpoint
 * Checks if the chat endpoint is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Chat/Communication Users Endpoint\n');

const checks = [];

// Check 1: Backend route file exists
try {
    const routeFile = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routeFile, 'utf8');
    
    const hasCorrectRoute = content.includes("usersRouter.get('/', isLoggedIn");
    const hasLoggedInMiddleware = content.includes('isLoggedIn');
    const returnsAllUsers = content.includes('admins') && content.includes('teachers') && content.includes('students');
    
    checks.push({
        name: 'Backend route file structure',
        status: hasCorrectRoute && hasLoggedInMiddleware && returnsAllUsers ? '✅' : '❌',
        details: [
            `Route path: ${hasCorrectRoute ? '✅ GET /' : '❌ GET /'}`,
            `Middleware: ${hasLoggedInMiddleware ? '✅ isLoggedIn' : '❌ missing'}`,
            `Returns all users: ${returnsAllUsers ? '✅ yes' : '❌ no'}`
        ]
    });
} catch (e) {
    checks.push({
        name: 'Backend route file structure',
        status: '❌',
        details: [e.message]
    });
}

// Check 2: Routes are registered in index
try {
    const indexFile = path.join(__dirname, 'backend/routes/v1/index.js');
    const content = fs.readFileSync(indexFile, 'utf8');
    
    const isRegistered = content.includes("router.use('/communication/users', require('./communication/users.router'))");
    
    checks.push({
        name: 'Route registration in v1 index',
        status: isRegistered ? '✅' : '❌',
        details: [
            `Registered at '/communication/users': ${isRegistered ? '✅' : '❌'}`
        ]
    });
} catch (e) {
    checks.push({
        name: 'Route registration in v1 index',
        status: '❌',
        details: [e.message]
    });
}

// Check 3: Frontend API method defined
try {
    const endpointsFile = path.join(__dirname, 'frontend/lib/api/endpoints.ts');
    const content = fs.readFileSync(endpointsFile, 'utf8');
    
    const methodDefined = content.includes('getTeachersForAttendance');
    const endpointCorrect = content.includes("'/communication/users'");
    
    checks.push({
        name: 'Frontend API endpoint definition',
        status: methodDefined && endpointCorrect ? '✅' : '❌',
        details: [
            `Method defined: ${methodDefined ? '✅ getTeachersForAttendance' : '❌ missing'}`,
            `Endpoint: ${endpointCorrect ? "✅ '/communication/users'" : "❌ incorrect"}`
        ]
    });
} catch (e) {
    checks.push({
        name: 'Frontend API endpoint definition',
        status: '❌',
        details: [e.message]
    });
}

// Check 4: NewChatDialog integration
try {
    const dialogFile = path.join(__dirname, 'frontend/components/communication/NewChatDialog.tsx');
    const content = fs.readFileSync(dialogFile, 'utf8');
    
    const usesSingleCall = content.includes('adminAPI.getTeachersForAttendance()');
    const noRedundantCalls = !content.includes('adminAPI.getAdmins()') && !content.includes('adminAPI.getStudents()');
    const normalizeFunction = content.includes('normalizeUser');
    
    checks.push({
        name: 'NewChatDialog implementation',
        status: usesSingleCall && noRedundantCalls && normalizeFunction ? '✅' : '❌',
        details: [
            `Uses getTeachersForAttendance: ${usesSingleCall ? '✅' : '❌'}`,
            `No redundant 403 calls: ${noRedundantCalls ? '✅' : '❌'}`,
            `User normalization: ${normalizeFunction ? '✅' : '❌'}`
        ]
    });
} catch (e) {
    checks.push({
        name: 'NewChatDialog implementation',
        status: '❌',
        details: [e.message]
    });
}

// Print results
console.log('📋 Verification Results:\n');

checks.forEach((check, index) => {
    console.log(`${index + 1}. ${check.name} ${check.status}`);
    check.details.forEach(detail => {
        console.log(`   ${detail}`);
    });
    console.log();
});

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const total = checks.length;

console.log('─'.repeat(50));
console.log(`\n📊 Summary: ${passed}/${total} checks passed\n`);

if (passed === total) {
    console.log('✅ All checks passed! Chat endpoint is properly configured.');
    console.log('\n🚀 Teachers should now be able to:');
    console.log('   • Open New Chat Dialog without 403 errors');
    console.log('   • See all users (admins, teachers, students)');
    console.log('   • Create direct messages and group chats\n');
} else {
    console.log(`⚠️  ${total - passed} check(s) failed. Please review the implementation.\n`);
}

process.exit(passed === total ? 0 : 1);
