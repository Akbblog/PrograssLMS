#!/usr/bin/env node

/**
 * Diagnostic Script: Communication Users Endpoint
 * Checks configuration and helps troubleshoot issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Communication Users Endpoint - Diagnostic Report\n');
console.log('=' .repeat(60));

const diagnostics = [];

// Check 1: Route file exists
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    if (fs.existsSync(routePath)) {
        diagnostics.push({ check: 'Route file exists', status: '✅', details: routePath });
    } else {
        diagnostics.push({ check: 'Route file exists', status: '❌', details: 'File not found' });
    }
} catch (e) {
    diagnostics.push({ check: 'Route file exists', status: '❌', details: e.message });
}

// Check 2: Route registration
try {
    const indexPath = path.join(__dirname, 'backend/routes/v1/index.js');
    const content = fs.readFileSync(indexPath, 'utf8');
    const hasRegistration = content.includes("router.use('/communication/users'");
    diagnostics.push({ 
        check: 'Route registered in index.js', 
        status: hasRegistration ? '✅' : '❌',
        details: hasRegistration ? 'Route registered' : 'Missing registration'
    });
} catch (e) {
    diagnostics.push({ check: 'Route registered in index.js', status: '❌', details: e.message });
}

// Check 3: SchoolId extraction
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    const hasCorrectSchoolId = content.includes('req.userAuth?.schoolId');
    const hasValidation = content.includes('if (!schoolId)');
    diagnostics.push({ 
        check: 'SchoolId extracted correctly', 
        status: hasCorrectSchoolId ? '✅' : '❌',
        details: hasCorrectSchoolId ? 'Using req.userAuth?.schoolId' : 'Incorrect property'
    });
    diagnostics.push({ 
        check: 'SchoolId validation present', 
        status: hasValidation ? '✅' : '❌',
        details: hasValidation ? 'Validation present' : 'No validation'
    });
} catch (e) {
    diagnostics.push({ check: 'SchoolId configuration', status: '❌', details: e.message });
}

// Check 4: Middleware chain
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    const hasIsLoggedIn = content.includes('isLoggedIn');
    const hasAsync = content.includes('async (req, res)');
    diagnostics.push({ 
        check: 'isLoggedIn middleware', 
        status: hasIsLoggedIn ? '✅' : '❌',
        details: hasIsLoggedIn ? 'Present' : 'Missing'
    });
    diagnostics.push({ 
        check: 'Async handler', 
        status: hasAsync ? '✅' : '❌',
        details: hasAsync ? 'Async/await setup' : 'Not async'
    });
} catch (e) {
    diagnostics.push({ check: 'Handler configuration', status: '❌', details: e.message });
}

// Check 5: User queries
try {
    const routePath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
    const content = fs.readFileSync(routePath, 'utf8');
    const queriesUsers = content.includes('User.find');
    const usesPromiseAll = content.includes('Promise.all');
    diagnostics.push({ 
        check: 'User queries configured', 
        status: queriesUsers ? '✅' : '❌',
        details: queriesUsers ? 'Queries all user types' : 'No user queries'
    });
    diagnostics.push({ 
        check: 'Parallel queries', 
        status: usesPromiseAll ? '✅' : '❌',
        details: usesPromiseAll ? 'Using Promise.all for efficiency' : 'Sequential queries'
    });
} catch (e) {
    diagnostics.push({ check: 'Query configuration', status: '❌', details: e.message });
}

// Check 6: Frontend integration
try {
    const endpointsPath = path.join(__dirname, 'frontend/lib/api/endpoints.ts');
    const content = fs.readFileSync(endpointsPath, 'utf8');
    const hasMethod = content.includes('getTeachersForAttendance');
    const correctEndpoint = content.includes("'/communication/users'");
    diagnostics.push({ 
        check: 'Frontend API method', 
        status: hasMethod ? '✅' : '❌',
        details: hasMethod ? 'getTeachersForAttendance defined' : 'Method missing'
    });
    diagnostics.push({ 
        check: 'Correct endpoint path', 
        status: correctEndpoint ? '✅' : '❌',
        details: correctEndpoint ? "Points to '/communication/users'" : 'Wrong endpoint'
    });
} catch (e) {
    diagnostics.push({ check: 'Frontend configuration', status: '❌', details: e.message });
}

// Print results
console.log('\n📋 Diagnostic Results:\n');

let passCount = 0;
diagnostics.forEach((diag, index) => {
    console.log(`${index + 1}. ${diag.check}`);
    console.log(`   Status: ${diag.status}`);
    console.log(`   Details: ${diag.details}`);
    console.log();
    if (diag.status === '✅') passCount++;
});

console.log('=' .repeat(60));
console.log(`\n📊 Summary: ${passCount}/${diagnostics.length} checks passed\n`);

if (passCount === diagnostics.length) {
    console.log('✅ Configuration looks good!\n');
    console.log('📝 Troubleshooting steps:');
    console.log('1. Verify Vercel has redeployed (check Vercel dashboard)');
    console.log('2. Try opening chat dialog in production');
    console.log('3. Check browser DevTools Console for errors');
    console.log('4. Verify you have a valid JWT token');
    console.log('5. Test locally: npm start && curl with Bearer token\n');
} else {
    console.log('⚠️ Issues detected. Review the failed checks above.\n');
}

console.log('🔗 Test the endpoint:');
console.log('   Development: http://localhost:5000/api/v1/communication/users');
console.log('   Production: https://progresslms-backend.vercel.app/api/v1/communication/users');
console.log('\n💡 Remember: Must include valid JWT in Authorization header!\n');

process.exit(passCount === diagnostics.length ? 0 : 1);
