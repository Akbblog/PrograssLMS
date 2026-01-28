#!/usr/bin/env node

/**
 * Teacher Dashboard Select Dropdown - Fix Verification
 * Verifies that the SelectContent component has the mounted state fix
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  SELECT DROPDOWN FIX - VERIFICATION SCRIPT             ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const selectPath = path.join(__dirname, 'frontend/components/ui/select.tsx');
const selectContent = fs.readFileSync(selectPath, 'utf8');

let passed = 0;
let failed = 0;

function check(text, condition) {
  if (condition) {
    console.log(`✅ ${text}`);
    passed++;
  } else {
    console.log(`❌ ${text}`);
    failed++;
  }
}

console.log('Checking SelectContent Component...\n');

// Check 1: mounted state exists
check('SelectContent has mounted state', 
  selectContent.includes('const [mounted, setMounted]'));

// Check 2: useEffect hook exists
check('SelectContent has useEffect hook',
  selectContent.includes('React.useEffect(() => {'));

// Check 3: setMounted(true) call
check('setMounted(true) called in useEffect',
  selectContent.includes('setMounted(true)'));

// Check 4: Early return if not mounted
check('Early return if not mounted',
  selectContent.includes('if (!mounted) return null'));

// Check 5: Portal still present
check('SelectPrimitive.Portal still present',
  selectContent.includes('<SelectPrimitive.Portal>'));

// Check 6: Content structure intact
check('SelectPrimitive.Content still present',
  selectContent.includes('<SelectPrimitive.Content'));

// Check 7: Viewport still present
check('SelectPrimitive.Viewport still present',
  selectContent.includes('<SelectPrimitive.Viewport'));

// Check 8: Scroll buttons present
check('SelectScrollUpButton present',
  selectContent.includes('<SelectScrollUpButton />'));

check('SelectScrollDownButton present',
  selectContent.includes('<SelectScrollDownButton />'));

// Check 9: No syntax errors in the component
const selectFunctionStart = selectContent.indexOf('function SelectContent');
const selectFunctionEnd = selectContent.indexOf('function SelectLabel');
const selectFunction = selectContent.substring(selectFunctionStart, selectFunctionEnd);
const openBraces = (selectFunction.match(/{/g) || []).length;
const closeBraces = (selectFunction.match(/}/g) || []).length;

check('SelectContent function has balanced braces',
  openBraces === closeBraces);

console.log('\n' + '─'.repeat(55));
console.log(`\nTotal Checks: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

const percentage = Math.round((passed / (passed + failed)) * 100);
console.log(`Success Rate: ${percentage}%`);

console.log('\n' + '╔' + '═'.repeat(53) + '╗');

if (failed === 0) {
  console.log('║  ✅ ALL CHECKS PASSED - FIX IS CORRECTLY APPLIED  ║');
  console.log('║                                                     ║');
  console.log('║  Next Steps:                                        ║');
  console.log('║  1. Restart dev server: npm run dev                ║');
  console.log('║  2. Clear browser cache (Ctrl+Shift+Delete)        ║');
  console.log('║  3. Hard refresh (Ctrl+Shift+R)                    ║');
  console.log('║  4. Test dropdowns at /teacher/performance         ║');
} else {
  console.log('║  ⚠️  SOME CHECKS FAILED - REVIEW THE FIX          ║');
  console.log('║                                                     ║');
  console.log('║  Check the failures above and verify the fix was   ║');
  console.log('║  applied correctly to SelectContent function       ║');
}

console.log('╚' + '═'.repeat(53) + '╝\n');

process.exit(failed === 0 ? 0 : 1);
