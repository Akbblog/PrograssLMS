# Cleanup Unnecessary Files Script
# This script removes all unnecessary files from the LMS project

Write-Host "🧹 Starting cleanup of unnecessary files..." -ForegroundColor Cyan

# Create backup directory
$backupDir = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (Test-Path $backupDir) {
    Write-Host "⚠️  Backup directory $backupDir already exists" -ForegroundColor Yellow
} else {
    Write-Host "📦 Creating backup directory: $backupDir" -ForegroundColor Green
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Function to safely delete files
function Safe-Delete {
    param(
        [string]$Path,
        [string]$Description = "file"
    )
    
    if (Test-Path $Path) {
        Write-Host "🗑️  Deleting $Description`: $Path" -ForegroundColor Yellow
        # Copy to backup first
        if (Test-Path $backupDir) {
            Copy-Item $Path $backupDir -Recurse -Force
        }
        Remove-Item $Path -Recurse -Force
    } else {
        Write-Host "ℹ️  File not found: $Path" -ForegroundColor Gray
    }
}

# Delete unnecessary documentation files
Write-Host "`n📚 Cleaning up documentation files..." -ForegroundColor Cyan
Safe-Delete "CLASS_ANALYSIS_BEFORE_AFTER.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_CODE_CHANGES.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_COMPLETE_INDEX.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_DELIVERABLES.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_DEPLOYMENT_CHECKLIST.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_FINAL_STATUS.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_MASTER_CHECKLIST.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_QUICK_REFERENCE.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_README.md" "documentation"
Safe-Delete "CLASS_ANALYSIS_VISUAL_SUMMARY.txt" "documentation"
Safe-Delete "TEACHER_DASHBOARD_COMPLETE_FIX.md" "documentation"
Safe-Delete "TEACHER_DASHBOARD_SELECT_FIX.md" "documentation"
Safe-Delete "SELECT_DROPDOWN_FIX_SUMMARY.md" "documentation"
Safe-Delete "SELECT_FIX_QUICK_START.md" "documentation"
Safe-Delete "DASHBOARD_COMPLETE_FIX_SUMMARY.md" "documentation"

# Delete test and verification files
Write-Host "`n🧪 Cleaning up test and verification files..." -ForegroundColor Cyan
Safe-Delete "test-class-analysis.js" "test script"
Safe-Delete "VERIFY_ANALYTICS_LOADING.js" "verification script"
Safe-Delete "VERIFY_BUILD_FIX.js" "verification script"
Safe-Delete "VERIFY_DASHBOARD_FIXES.js" "verification script"
Safe-Delete "VERIFY_SELECT_FIX.js" "verification script"

# Delete debug and development files
Write-Host "`n🐛 Cleaning up debug and development files..." -ForegroundColor Cyan
Safe-Delete "DEBUGGING_SESSION_SUMMARY.md" "debug session notes"
Safe-Delete "IMPLEMENTATION_SUMMARY.md" "implementation notes"
Safe-Delete "SECURITY_FIX_SUMMARY.md" "security fix notes"
Safe-Delete "NOTIFICATIONS.md" "notification documentation"
Safe-Delete "DEPLOYING.md" "deployment notes"

# Delete prompt files
Write-Host "`n📝 Cleaning up prompt files..." -ForegroundColor Cyan
Safe-Delete "PROMPT_1_BUGFIX_LIBRARY_TRANSPORT.md" "prompt file"
Safe-Delete "PROMPT_2_ATTENDANCE_HR.md" "prompt file"
Safe-Delete "PROMPT_3_DOCUMENTS_MIGRATION.md" "prompt file"

# Delete demo and testing files
Write-Host "`n🎭 Cleaning up demo and testing files..." -ForegroundColor Cyan
Safe-Delete "DEMO_CREDENTIALS.md" "demo credentials"
Safe-Delete "test-logins.ps1" "test login script"

# Delete temporary files
Write-Host "`n🗂️  Cleaning up temporary files..." -ForegroundColor Cyan
Safe-Delete "tmp-out.js" "temporary output file"

# Delete report files
Write-Host "`n📊 Cleaning up report files..." -ForegroundColor Cyan
Safe-Delete "CARD_GENERATION_COMPLETION_REPORT.md" "completion report"

# Summary
Write-Host "`n✨ Cleanup completed!" -ForegroundColor Green
Write-Host "📦 Backup created in: $backupDir" -ForegroundColor Green
Write-Host "🎯 Project is now cleaner and more organized" -ForegroundColor Green

# Show what's left
Write-Host "`n📋 Remaining important files:" -ForegroundColor Cyan
Get-ChildItem -Path "." -File | Where-Object { 
    $_.Name -match "^(package\.json|README\.md|\.gitignore|deploy-vercel\.ps1|seed-vercel\.ps1)$" 
} | ForEach-Object {
    Write-Host "  ✅ $($_.Name)" -ForegroundColor Green
}

Write-Host "`n🚀 Your LMS project is now optimized and ready for development!" -ForegroundColor Green