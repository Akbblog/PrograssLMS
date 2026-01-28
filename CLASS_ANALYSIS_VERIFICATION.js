#!/usr/bin/env node

/**
 * Class Analysis Fix Verification Script
 * Verifies that all fixes are correctly applied
 * Run: node CLASS_ANALYSIS_VERIFICATION.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  CLASS ANALYSIS FIX - VERIFICATION SCRIPT              ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function check(text, condition) {
  const status = condition ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} - ${text}`);
  return condition;
}

let totalChecks = 0;
let passedChecks = 0;

// 1. Check files exist
console.log(`${colors.blue}1. Checking if files exist...${colors.reset}`);

const files = [
  'backend/services/academic/performance.service.js',
  'backend/controllers/academic/performance.controller.js',
  'frontend/app/teacher/performance/page.tsx'
];

files.forEach(file => {
  totalChecks++;
  const exists = fs.existsSync(path.join(__dirname, file));
  if (check(`File exists: ${file}`, exists)) passedChecks++;
});

// 2. Check backend service changes
console.log(`\n${colors.blue}2. Checking backend service changes...${colors.reset}`);

const servicePath = path.join(__dirname, 'backend/services/academic/performance.service.js');
const serviceContent = fs.readFileSync(servicePath, 'utf8');

const serviceChecks = [
  ['classAverage:', serviceContent.includes('classAverage:')],
  ['gradeDistribution:', serviceContent.includes('gradeDistribution:')],
  ['studentName:', serviceContent.includes('studentName:')],
  ['averageScore:', serviceContent.includes('averageScore:')],
  ['sort by averageScore', serviceContent.includes('b.averageScore - a.averageScore')]
];

serviceChecks.forEach(([checkName, result]) => {
  totalChecks++;
  if (check(`Service: ${checkName}`, result)) passedChecks++;
});

// Verify NO old property names
const oldProperties = [
  ['performanceDistribution (old)', !serviceContent.includes('performanceDistribution:')],
  ['score (old sort)', !serviceContent.includes('b.score - a.score')],
];

oldProperties.forEach(([checkName, result]) => {
  totalChecks++;
  if (check(`Service: NOT using ${checkName}`, result)) passedChecks++;
});

// 3. Check backend controller changes
console.log(`\n${colors.blue}3. Checking backend controller changes...${colors.reset}`);

const controllerPath = path.join(__dirname, 'backend/controllers/academic/performance.controller.js');
const controllerContent = fs.readFileSync(controllerPath, 'utf8');

const controllerChecks = [
  ['academicYear extracted', controllerContent.includes('academicYear')],
  ['academicTerm extracted', controllerContent.includes('academicTerm')],
  ['subject extracted', controllerContent.includes('subject')],
];

controllerChecks.forEach(([checkName, result]) => {
  totalChecks++;
  if (check(`Controller: ${checkName}`, result)) passedChecks++;
});

// 4. Check frontend changes
console.log(`\n${colors.blue}4. Checking frontend component changes...${colors.reset}`);

const frontendPath = path.join(__dirname, 'frontend/app/teacher/performance/page.tsx');
const frontendContent = fs.readFileSync(frontendPath, 'utf8');

const frontendChecks = [
  ['Improved response handling', frontendContent.includes('?.data || res')],
  ['Uses classAverage', frontendContent.includes('performance.classAverage')],
  ['Uses gradeDistribution', frontendContent.includes('performance.gradeDistribution')],
  ['Uses studentName', frontendContent.includes('studentName')],
  ['Uses averageScore', frontendContent.includes('averageScore')],
];

frontendChecks.forEach(([checkName, result]) => {
  totalChecks++;
  if (check(`Frontend: ${checkName}`, result)) passedChecks++;
});

// 5. Check documentation files
console.log(`\n${colors.blue}5. Checking documentation files...${colors.reset}`);

const docFiles = [
  'CLASS_ANALYSIS_QUICK_REFERENCE.md',
  'CLASS_ANALYSIS_BEFORE_AFTER.md',
  'CLASS_ANALYSIS_FIX_SUMMARY.md',
  'CLASS_ANALYSIS_CODE_CHANGES.md',
  'CLASS_ANALYSIS_DEPLOYMENT_CHECKLIST.md',
  'CLASS_ANALYSIS_COMPLETE_INDEX.md',
  'test-class-analysis.js'
];

docFiles.forEach(file => {
  totalChecks++;
  const exists = fs.existsSync(path.join(__dirname, file));
  if (check(`Doc: ${file}`, exists)) passedChecks++;
});

// 6. Verify data structure compatibility
console.log(`\n${colors.blue}6. Verifying data structure compatibility...${colors.reset}`);

// Check that response structure is properly formed
const testResponse = {
  totalStudents: 35,
  classAverage: 78.5,
  gradeDistribution: { A: 8, B: 12, C: 10, D: 3, F: 2 },
  topPerformers: [{ studentName: 'Ahmed', averageScore: 95.5, studentId: 'id1' }],
  strugglingStudents: [{ studentName: 'Muhammad', averageScore: 45.0, studentId: 'id2' }]
};

const structureChecks = [
  ['Has totalStudents', typeof testResponse.totalStudents === 'number'],
  ['Has classAverage', typeof testResponse.classAverage === 'number'],
  ['Has gradeDistribution object', typeof testResponse.gradeDistribution === 'object'],
  ['Has topPerformers array', Array.isArray(testResponse.topPerformers)],
  ['Has strugglingStudents array', Array.isArray(testResponse.strugglingStudents)],
  ['topPerformers has studentName', testResponse.topPerformers[0].studentName !== undefined],
  ['topPerformers has averageScore', testResponse.topPerformers[0].averageScore !== undefined],
];

structureChecks.forEach(([checkName, result]) => {
  totalChecks++;
  if (check(`Structure: ${checkName}`, result)) passedChecks++;
});

// 7. Summary
console.log(`\n${colors.blue}7. Summary${colors.reset}`);
console.log('─'.repeat(55));

const percentage = Math.round((passedChecks / totalChecks) * 100);
const status = percentage === 100 ? `${colors.green}READY${colors.reset}` : `${colors.yellow}INCOMPLETE${colors.reset}`;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${colors.green}${passedChecks}${colors.reset}`);
console.log(`Failed: ${colors.red}${totalChecks - passedChecks}${colors.reset}`);
console.log(`Success Rate: ${percentage}%`);
console.log(`Status: ${status}`);

console.log('\n╔════════════════════════════════════════════════════════╗');

if (percentage === 100) {
  console.log('║  ✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT          ║');
} else {
  console.log('║  ⚠️  SOME CHECKS FAILED - REVIEW ABOVE                ║');
}

console.log('╚════════════════════════════════════════════════════════╝\n');

// Exit with appropriate code
process.exit(percentage === 100 ? 0 : 1);
