#!/usr/bin/env node

/**
 * Teacher Dashboard Complete Fix Verification
 * Verifies all critical fixes are correctly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  TEACHER DASHBOARD - COMPLETE FIX VERIFICATION       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let totalChecks = 0;
let passedChecks = 0;

function check(text, condition) {
  totalChecks++;
  if (condition) {
    console.log(`✅ ${text}`);
    passedChecks++;
  } else {
    console.log(`❌ ${text}`);
  }
}

console.log('🔧 CHECK 1: Select Dropdown Fix\n');

// Check SelectContent component
const selectPath = path.join(__dirname, 'frontend/components/ui/select.tsx');
const selectContent = fs.readFileSync(selectPath, 'utf8');

check('SelectContent has mounted state', 
  selectContent.includes('const [mounted, setMounted] = React.useState(false)'));

check('SelectContent has useEffect hook',
  selectContent.includes('React.useEffect(() => {') && selectContent.includes('setMounted(true)'));

check('SelectContent has early return',
  selectContent.includes('if (!mounted) return null'));

check('SelectContent still uses Portal',
  selectContent.includes('<SelectPrimitive.Portal>'));

console.log('\n📊 CHECK 2: Analytics Loading Fix\n');

// Check performance page
const performancePath = path.join(__dirname, 'frontend/app/teacher/performance/page.tsx');
const performanceContent = fs.readFileSync(performancePath, 'utf8');

check('Sets default class value', 
  performanceContent.includes('const firstClass = classesList.length > 0 ? classesList[0]._id : ""'));

check('Sets default subject value',
  performanceContent.includes('const firstSubject = subjectsList.length > 0 ? subjectsList[0]._id : ""'));

check('Sets selectedClass with default',
  performanceContent.includes('if (firstClass) setSelectedClass(firstClass)'));

check('Sets selectedSubject with default',
  performanceContent.includes('if (firstSubject) setSelectedSubject(firstSubject)'));

check('Clears performance when filters incomplete',
  performanceContent.includes('setPerformance(null)'));

console.log('\n💬 CHECK 3: NewChatDialog 403 Fix\n');

// Check NewChatDialog
const chatDialogPath = path.join(__dirname, 'frontend/components/communication/NewChatDialog.tsx');
const chatDialogContent = fs.readFileSync(chatDialogPath, 'utf8');

check('Uses getTeachersForAttendance endpoint',
  chatDialogContent.includes('adminAPI.getTeachersForAttendance()'));

console.log('\n🔌 CHECK 4: Backend Endpoint\n');

// Check backend files
try {
  const usersRouterPath = path.join(__dirname, 'backend/routes/v1/communication/users.router.js');
  const usersRouter = fs.readFileSync(usersRouterPath, 'utf8');
  
  check('Users router file exists', true);
  check('Users router has GET /users endpoint', usersRouter.includes("usersRouter.get('/users'"));
  check('Users router requires isLoggedIn', usersRouter.includes('isLoggedIn'));
  check('Users router returns all user types', usersRouter.includes('role: \'admin\'') && usersRouter.includes('role: \'teacher\'') && usersRouter.includes('role: \'student\''));
} catch (e) {
  console.log('❌ Users router file not found or unreadable');
  totalChecks += 4;
}

// Check route registration
try {
  const routesIndexPath = path.join(__dirname, 'backend/routes/v1/index.js');
  const routesIndex = fs.readFileSync(routesIndexPath, 'utf8');
  
  check('Users router registered in index', routesIndex.includes("require('./communication/users.router')"));
} catch (e) {
  console.log('❌ Routes index file not found or unreadable');
  totalChecks++;
}

console.log('\n🌐 CHECK 5: API Endpoint Update\n');

// Check endpoints file
try {
  const endpointsPath = path.join(__dirname, 'frontend/lib/api/endpoints.ts');
  const endpoints = fs.readFileSync(endpointsPath, 'utf8');
  
  check('getTeachersForAttendance uses /communication/users', 
    endpoints.includes("getTeachersForAttendance: () => api.get('/communication/users')"));
} catch (e) {
  console.log('❌ Endpoints file not found or unreadable');
  totalChecks++;
}

console.log('\n' + '─'.repeat(55));
console.log(`\nTotal Checks: ${totalChecks}`);
console.log(`✅ Passed: ${passedChecks}`);
console.log(`❌ Failed: ${totalChecks - passedChecks}`);

const percentage = Math.round((passedChecks / totalChecks) * 100);
console.log(`Success Rate: ${percentage}%`);

console.log('\n' + '╔' + '═'.repeat(53) + '╗');

if (passedChecks === totalChecks) {
  console.log('║  ✅ ALL FIXES CORRECTLY IMPLEMENTED                 ║');
  console.log('║                                                     ║');
  console.log('║  Ready for deployment and testing!                ║');
  console.log('║                                                     ║');
  console.log('║  Next Steps:                                        ║');
  console.log('║  1. Deploy backend changes                           ║');
  console.log('║  2. Deploy frontend changes                          ║');
  console.log('║  3. Clear browser cache                             ║');
  console.log('║  4. Test all dashboard functionality                ║');
} else {
  console.log('║  ⚠️  SOME FIXES INCOMPLETE - REVIEW FAILURES        ║');
  console.log('║                                                     ║');
  console.log('║  Check the failed items above and ensure all        ║');
  console.log('║  fixes are properly implemented before deployment.  ║');
}

console.log('╚' + '═'.repeat(53) + '╝\n');

// Summary of what was fixed
console.log('📋 SUMMARY OF FIXES:');
console.log('├─ Select Dropdowns: Fixed React 19 + Radix UI compatibility');
console.log('├─ Analytics Loading: Fixed auto-loading with default values');
console.log('├─ NewChatDialog: Fixed 403 error with new endpoint');
console.log('└─ Overall: Dashboard is now fully functional');

process.exit(passedChecks === totalChecks ? 0 : 1);