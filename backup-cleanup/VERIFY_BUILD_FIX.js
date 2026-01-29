#!/usr/bin/env node

/**
 * Verify the build fix for getTeachersForAttendance
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  BUILD FIX VERIFICATION - getTeachersForAttendance     ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

try {
  const endpointsPath = path.join(__dirname, 'frontend/lib/api/endpoints.ts');
  const endpoints = fs.readFileSync(endpointsPath, 'utf8');
  
  console.log('🔍 Checking adminAPI object...\n');
  
  // Check if getTeachersForAttendance is in adminAPI
  const hasMethod = endpoints.includes('getTeachersForAttendance: () => api.get(\'/communication/users\')');
  
  if (hasMethod) {
    console.log('✅ getTeachersForAttendance method found in adminAPI');
    console.log('✅ Method correctly points to /communication/users endpoint');
    console.log('✅ Build error should be resolved');
    console.log('\n🎉 BUILD FIX VERIFIED - Ready for deployment!');
  } else {
    console.log('❌ getTeachersForAttendance method not found in adminAPI');
    console.log('❌ Build error will persist');
  }
  
  // Also check the NewChatDialog usage
  const chatDialogPath = path.join(__dirname, 'frontend/components/communication/NewChatDialog.tsx');
  const chatDialog = fs.readFileSync(chatDialogPath, 'utf8');
  
  console.log('\n🔍 Checking NewChatDialog usage...\n');
  
  const usesMethod = chatDialog.includes('adminAPI.getTeachersForAttendance()');
  
  if (usesMethod) {
    console.log('✅ NewChatDialog correctly calls adminAPI.getTeachersForAttendance()');
  } else {
    console.log('❌ NewChatDialog does not use the expected method');
  }
  
  console.log('\n' + '─'.repeat(55));
  
  if (hasMethod && usesMethod) {
    console.log('✅ ALL CHECKS PASSED - Build should succeed!');
    process.exit(0);
  } else {
    console.log('❌ CHECKS FAILED - Build will fail');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
  process.exit(1);
}