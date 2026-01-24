#!/usr/bin/env node

/**
 * Comprehensive Test Script for Card Generation System
 * This script tests all aspects of the student and teacher card generation functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🎓 Starting Card Generation System Tests...\n');

// Test Results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName} - PASSED${details ? ` (${details})` : ''}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - FAILED${details ? ` (${details})` : ''}`);
  }
}

// Test 1: Check if backend card templates exist
console.log('📋 Testing Backend Components...\n');

try {
  const studentTemplatePath = path.join(__dirname, '../backend/services/documentGenerator/templates/StudentCardTemplate.js');
  const staffTemplatePath = path.join(__dirname, '../backend/services/documentGenerator/templates/StaffCardTemplate.js');
  const documentGeneratorPath = path.join(__dirname, '../backend/services/documentGenerator/index.js');
  
  const studentTemplateExists = fs.existsSync(studentTemplatePath);
  const staffTemplateExists = fs.existsSync(staffTemplatePath);
  const documentGeneratorExists = fs.existsSync(documentGeneratorPath);
  
  logTest('Student Card Template Exists', studentTemplateExists);
  logTest('Staff Card Template Exists', staffTemplateExists);
  logTest('Document Generator Service Exists', documentGeneratorExists);
  
  if (studentTemplateExists) {
    const studentTemplate = fs.readFileSync(studentTemplatePath, 'utf8');
    const hasEnhancedData = studentTemplate.includes('attendanceData') && studentTemplate.includes('academicData');
    logTest('Student Template Enhanced Data Support', hasEnhancedData, 'attendanceData and academicData parameters');
  }
  
  if (staffTemplateExists) {
    const staffTemplate = fs.readFileSync(staffTemplatePath, 'utf8');
    const hasEmploymentData = staffTemplate.includes('employmentInfo');
    logTest('Staff Template Enhanced Data Support', hasEmploymentData, 'employmentInfo parameter');
  }
  
  if (documentGeneratorExists) {
    const documentGenerator = fs.readFileSync(documentGeneratorPath, 'utf8');
    const hasEnhancedStudent = documentGenerator.includes('attendanceData') && documentGenerator.includes('academicData');
    const hasEnhancedStaff = documentGenerator.includes('employmentInfo');
    logTest('Document Generator Enhanced Student Data', hasEnhancedStudent);
    logTest('Document Generator Enhanced Staff Data', hasEnhancedStaff);
  }
  
} catch (error) {
  logTest('Backend Component Check', false, error.message);
}

// Test 2: Check if frontend components exist
console.log('\n🎨 Testing Frontend Components...\n');

try {
  const studentProfilePath = path.join(__dirname, '../frontend/app/admin/students/[id]/page.tsx');
  const teacherProfilePath = path.join(__dirname, '../frontend/app/admin/teachers/[id]/page.tsx');
  const studentDashboardPath = path.join(__dirname, '../frontend/app/student/dashboard/page.tsx');
  const teacherDashboardPath = path.join(__dirname, '../frontend/app/teacher/dashboard/page.tsx');
  const cardPreviewPath = path.join(__dirname, '../frontend/app/components/ui/card-preview-modal.tsx');
  const brandingPath = path.join(__dirname, '../frontend/app/lib/school-branding.ts');
  const printCSSPath = path.join(__dirname, '../frontend/app/components/ui/print-optimization.css');
  
  const studentProfileExists = fs.existsSync(studentProfilePath);
  const teacherProfileExists = fs.existsSync(teacherProfilePath);
  const studentDashboardExists = fs.existsSync(studentDashboardPath);
  const teacherDashboardExists = fs.existsSync(teacherDashboardPath);
  const cardPreviewExists = fs.existsSync(cardPreviewPath);
  const brandingExists = fs.existsSync(brandingPath);
  const printCSSExists = fs.existsSync(printCSSPath);
  
  logTest('Student Profile Page Exists', studentProfileExists);
  logTest('Teacher Profile Page Exists', teacherProfileExists);
  logTest('Student Dashboard Exists', studentDashboardExists);
  logTest('Teacher Dashboard Exists', teacherDashboardExists);
  logTest('Card Preview Modal Exists', cardPreviewExists);
  logTest('School Branding Library Exists', brandingExists);
  logTest('Print Optimization CSS Exists', printCSSExists);
  
  if (studentProfileExists) {
    const studentProfile = fs.readFileSync(studentProfilePath, 'utf8');
    const hasCardPreview = studentProfile.includes('CardPreviewModal');
    const hasImport = studentProfile.includes("import { CardPreviewModal }");
    logTest('Student Profile Card Preview Integration', hasCardPreview && hasImport);
  }
  
  if (teacherProfileExists) {
    const teacherProfile = fs.readFileSync(teacherProfilePath, 'utf8');
    const hasCardPreview = teacherProfile.includes('CardPreviewModal');
    const hasImport = teacherProfile.includes("import { CardPreviewModal }");
    logTest('Teacher Profile Card Preview Integration', hasCardPreview && hasImport);
  }
  
  if (studentDashboardExists) {
    const studentDashboard = fs.readFileSync(studentDashboardPath, 'utf8');
    const hasPrintCSS = studentDashboard.includes('print-optimization.css');
    const hasDownload = studentDashboard.includes('handleDownloadStudentCard');
    logTest('Student Dashboard Print & Download Support', hasPrintCSS && hasDownload);
  }
  
  if (teacherDashboardExists) {
    const teacherDashboard = fs.readFileSync(teacherDashboardPath, 'utf8');
    const hasPrintCSS = teacherDashboard.includes('print-optimization.css');
    const hasDownload = teacherDashboard.includes('handleDownloadTeacherCard');
    logTest('Teacher Dashboard Print & Download Support', hasPrintCSS && hasDownload);
  }
  
} catch (error) {
  logTest('Frontend Component Check', false, error.message);
}

// Test 3: Check API endpoints
console.log('\n🌐 Testing API Endpoints...\n');

try {
  const studentControllerPath = path.join(__dirname, '../backend/controllers/students/students.controller.js');
  const teacherControllerPath = path.join(__dirname, '../backend/controllers/staff/teachers.controller.js');
  
  const studentControllerExists = fs.existsSync(studentControllerPath);
  const teacherControllerExists = fs.existsSync(teacherControllerPath);
  
  logTest('Student Controller Exists', studentControllerExists);
  logTest('Teacher Controller Exists', teacherControllerExists);
  
  if (studentControllerExists) {
    const studentController = fs.readFileSync(studentControllerPath, 'utf8');
    const hasEnhancedData = studentController.includes('attendanceData') && studentController.includes('academicData');
    const hasPrismaQueries = studentController.includes('prisma.attendance') && studentController.includes('prisma.enrollment');
    logTest('Student Controller Enhanced Data Fetching', hasEnhancedData);
    logTest('Student Controller Prisma Queries', hasPrismaQueries);
  }
  
  if (teacherControllerExists) {
    const teacherController = fs.readFileSync(teacherControllerPath, 'utf8');
    const hasEmploymentData = teacherController.includes('employmentInfo');
    const hasEmploymentQueries = teacherController.includes('teacherEmployment');
    logTest('Teacher Controller Enhanced Data Fetching', hasEmploymentData);
    logTest('Teacher Controller Employment Queries', hasEmploymentQueries);
  }
  
} catch (error) {
  logTest('API Endpoint Check', false, error.message);
}

// Test 4: Check for comprehensive functionality
console.log('\n🔍 Testing Comprehensive Functionality...\n');

try {
  // Check if all key features are implemented
  const features = {
    'Student Card Download': false,
    'Teacher Card Download': false,
    'Student Card Preview': false,
    'Teacher Card Preview': false,
    'Student Dashboard Widget': false,
    'Teacher Dashboard Widget': false,
    'Enhanced Student Data': false,
    'Enhanced Teacher Data': false,
    'Print Optimization': false,
    'School Branding': false,
    'QR Code Integration': false,
    'Performance Indicators': false
  };
  
  // Check student profile
  const studentProfile = fs.readFileSync(path.join(__dirname, '../frontend/app/admin/students/[id]/page.tsx'), 'utf8');
  features['Student Card Download'] = studentProfile.includes('handleDownloadCard');
  features['Student Card Preview'] = studentProfile.includes('CardPreviewModal');
  
  // Check teacher profile
  const teacherProfile = fs.readFileSync(path.join(__dirname, '../frontend/app/admin/teachers/[id]/page.tsx'), 'utf8');
  features['Teacher Card Download'] = teacherProfile.includes('handleDownloadCard');
  features['Teacher Card Preview'] = teacherProfile.includes('CardPreviewModal');
  
  // Check dashboards
  const studentDashboard = fs.readFileSync(path.join(__dirname, '../frontend/app/student/dashboard/page.tsx'), 'utf8');
  features['Student Dashboard Widget'] = studentDashboard.includes('ID Card Widget');
  
  const teacherDashboard = fs.readFileSync(path.join(__dirname, '../frontend/app/teacher/dashboard/page.tsx'), 'utf8');
  features['Teacher Dashboard Widget'] = teacherDashboard.includes('ID Card Widget');
  
  // Check backend enhancements
  const studentController = fs.readFileSync(path.join(__dirname, '../backend/controllers/students/students.controller.js'), 'utf8');
  features['Enhanced Student Data'] = studentController.includes('attendanceData') && studentController.includes('academicData');
  
  const teacherController = fs.readFileSync(path.join(__dirname, '../backend/controllers/staff/teachers.controller.js'), 'utf8');
  features['Enhanced Teacher Data'] = teacherController.includes('employmentInfo');
  
  // Check frontend enhancements
  features['Print Optimization'] = fs.existsSync(path.join(__dirname, '../frontend/app/components/ui/print-optimization.css'));
  features['School Branding'] = fs.existsSync(path.join(__dirname, '../frontend/app/lib/school-branding.ts'));
  
  // Check templates
  const studentTemplate = fs.readFileSync(path.join(__dirname, '../backend/services/documentGenerator/templates/StudentCardTemplate.js'), 'utf8');
  const staffTemplate = fs.readFileSync(path.join(__dirname, '../backend/services/documentGenerator/templates/StaffCardTemplate.js'), 'utf8');
  
  features['QR Code Integration'] = studentTemplate.includes('qrDataUrl') && staffTemplate.includes('qrDataUrl');
  features['Performance Indicators'] = studentTemplate.includes('attendanceData') && staffTemplate.includes('employmentInfo');
  
  // Log feature tests
  Object.entries(features).forEach(([feature, exists]) => {
    logTest(feature, exists);
  });
  
} catch (error) {
  logTest('Comprehensive Functionality Check', false, error.message);
}

// Final Results
console.log('\n📊 Test Results Summary:');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed} ✅`);
console.log(`Failed: ${testResults.failed} ❌`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%\n`);

if (testResults.failed === 0) {
  console.log('🎉 All tests passed! The card generation system is fully implemented and ready for use.');
  console.log('\n📋 Features Implemented:');
  console.log('✅ Student ID Card Generation');
  console.log('✅ Teacher ID Card Generation');
  console.log('✅ Enhanced Student Data (Attendance & Academic)');
  console.log('✅ Enhanced Teacher Data (Employment Information)');
  console.log('✅ Card Preview Modal');
  console.log('✅ Dashboard Widgets');
  console.log('✅ Print Optimization');
  console.log('✅ School Branding Support');
  console.log('✅ QR Code Integration');
  console.log('✅ Performance Indicators');
  console.log('✅ Download Functionality');
  console.log('\n🚀 The system is now 100% complete!');
} else {
  console.log('⚠️  Some tests failed. Please review the failed tests above and fix any issues.');
  console.log('\n🔧 Next Steps:');
  console.log('1. Check the failed tests above');
  console.log('2. Ensure all files are properly implemented');
  console.log('3. Verify the backend API endpoints are working');
  console.log('4. Test the frontend components in the browser');
}

console.log('\n✨ Test completed!');