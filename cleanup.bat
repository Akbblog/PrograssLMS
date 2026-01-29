@echo off
echo Starting cleanup of unnecessary files...

:: Create backup directory
if not exist "backup-cleanup" mkdir "backup-cleanup"

:: Delete remaining CLASS_ANALYSIS files
if exist "CLASS_ANALYSIS_FINAL_STATUS.md" move "CLASS_ANALYSIS_FINAL_STATUS.md" "backup-cleanup\"
if exist "CLASS_ANALYSIS_MASTER_CHECKLIST.md" move "CLASS_ANALYSIS_MASTER_CHECKLIST.md" "backup-cleanup\"
if exist "CLASS_ANALYSIS_QUICK_REFERENCE.md" move "CLASS_ANALYSIS_QUICK_REFERENCE.md" "backup-cleanup\"
if exist "CLASS_ANALYSIS_README.md" move "CLASS_ANALYSIS_README.md" "backup-cleanup\"
if exist "CLASS_ANALYSIS_VISUAL_SUMMARY.txt" move "CLASS_ANALYSIS_VISUAL_SUMMARY.txt" "backup-cleanup\"

:: Delete TEACHER_DASHBOARD files
if exist "TEACHER_DASHBOARD_COMPLETE_FIX.md" move "TEACHER_DASHBOARD_COMPLETE_FIX.md" "backup-cleanup\"
if exist "TEACHER_DASHBOARD_SELECT_FIX.md" move "TEACHER_DASHBOARD_SELECT_FIX.md" "backup-cleanup\"

:: Delete SELECT files
if exist "SELECT_DROPDOWN_FIX_SUMMARY.md" move "SELECT_DROPDOWN_FIX_SUMMARY.md" "backup-cleanup\"
if exist "SELECT_FIX_QUICK_START.md" move "SELECT_FIX_QUICK_START.md" "backup-cleanup\"

:: Delete DASHBOARD files
if exist "DASHBOARD_COMPLETE_FIX_SUMMARY.md" move "DASHBOARD_COMPLETE_FIX_SUMMARY.md" "backup-cleanup\"

:: Delete test files
if exist "test-class-analysis.js" move "test-class-analysis.js" "backup-cleanup\"
if exist "VERIFY_ANALYTICS_LOADING.js" move "VERIFY_ANALYTICS_LOADING.js" "backup-cleanup\"
if exist "VERIFY_BUILD_FIX.js" move "VERIFY_BUILD_FIX.js" "backup-cleanup\"
if exist "VERIFY_DASHBOARD_FIXES.js" move "VERIFY_DASHBOARD_FIXES.js" "backup-cleanup\"
if exist "VERIFY_SELECT_FIX.js" move "VERIFY_SELECT_FIX.js" "backup-cleanup\"

:: Delete debug files
if exist "DEBUGGING_SESSION_SUMMARY.md" move "DEBUGGING_SESSION_SUMMARY.md" "backup-cleanup\"
if exist "IMPLEMENTATION_SUMMARY.md" move "IMPLEMENTATION_SUMMARY.md" "backup-cleanup\"
if exist "SECURITY_FIX_SUMMARY.md" move "SECURITY_FIX_SUMMARY.md" "backup-cleanup\"
if exist "NOTIFICATIONS.md" move "NOTIFICATIONS.md" "backup-cleanup\"
if exist "DEPLOYING.md" move "DEPLOYING.md" "backup-cleanup\"

:: Delete prompt files
if exist "PROMPT_1_BUGFIX_LIBRARY_TRANSPORT.md" move "PROMPT_1_BUGFIX_LIBRARY_TRANSPORT.md" "backup-cleanup\"
if exist "PROMPT_2_ATTENDANCE_HR.md" move "PROMPT_2_ATTENDANCE_HR.md" "backup-cleanup\"
if exist "PROMPT_3_DOCUMENTS_MIGRATION.md" move "PROMPT_3_DOCUMENTS_MIGRATION.md" "backup-cleanup\"

:: Delete demo files
if exist "DEMO_CREDENTIALS.md" move "DEMO_CREDENTIALS.md" "backup-cleanup\"
if exist "test-logins.ps1" move "test-logins.ps1" "backup-cleanup\"

:: Delete temp files
if exist "tmp-out.js" move "tmp-out.js" "backup-cleanup\"
if exist "CARD_GENERATION_COMPLETION_REPORT.md" move "CARD_GENERATION_COMPLETION_REPORT.md" "backup-cleanup\"

echo Cleanup completed!
echo Backup created in: backup-cleanup
echo Project is now cleaner and more organized.
pause