# Test Login Script - Verify Credentials Work
# This script tests all login endpoints with the correct credentials

param(
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://progresslms-backend.vercel.app/api/v1"
)

$ErrorActionPreference = "Continue"

Write-Host "🧪 Testing Login Endpoints..." -ForegroundColor Cyan
Write-Host "📍 API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host ""

# Test credentials
$tests = @(
    @{
        Role = "Superadmin"
        Endpoint = "/superadmin/login"
        Email = "SA@progresslms.com"
        Password = "Superpass"
    },
    @{
        Role = "Admin"
        Endpoint = "/admin/login"
        Email = "admin@alnoor-academy.edu"
        Password = "admin123"
    },
    @{
        Role = "Teacher"
        Endpoint = "/teachers/login"
        Email = "hassan.rashid@islamic-school.edu"
        Password = "teacher123"
    },
    @{
        Role = "Student"
        Endpoint = "/students/login"
        Email = "amr.abdullah@islamic-school.edu"
        Password = "student123"
    }
)

$results = @()

foreach ($test in $tests) {
    Write-Host "Testing $($test.Role) login..." -ForegroundColor White -NoNewline
    
    $body = @{
        email = $test.Email
        password = $test.Password
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$ApiUrl$($test.Endpoint)" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 10
        
        if ($response.success -and $response.data.token) {
            Write-Host " ✅ SUCCESS" -ForegroundColor Green
            $results += @{
                Role = $test.Role
                Status = "✅ Pass"
                Message = "Login successful"
            }
        } else {
            Write-Host " ⚠️ UNEXPECTED RESPONSE" -ForegroundColor Yellow
            $results += @{
                Role = $test.Role
                Status = "⚠️ Warning"
                Message = "Response format unexpected"
            }
        }
    } catch {
        $statusCode = "N/A"
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
        }
        
        if ($statusCode -eq 401) {
            Write-Host " ❌ FAILED (401 Unauthorized)" -ForegroundColor Red
            $results += @{
                Role = $test.Role
                Status = "❌ Fail"
                Message = "401 Unauthorized - Check if database is seeded"
            }
        } else {
            Write-Host " ❌ FAILED ($statusCode)" -ForegroundColor Red
            $results += @{
                Role = $test.Role
                Status = "❌ Fail"
                Message = "Error: $($_.Exception.Message)"
            }
        }
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

foreach ($result in $results) {
    Write-Host "  $($result.Role): " -NoNewline -ForegroundColor White
    Write-Host "$($result.Status)" -NoNewline
    Write-Host " - $($result.Message)" -ForegroundColor Gray
}

Write-Host ""

# Count results
$passed = ($results | Where-Object { $_.Status -eq "✅ Pass" }).Count
$failed = ($results | Where-Object { $_.Status -eq "❌ Fail" }).Count
$warnings = ($results | Where-Object { $_.Status -eq "⚠️ Warning" }).Count

Write-Host "Total: $($results.Count) tests" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Failed: $failed" -ForegroundColor Red
}
if ($warnings -gt 0) {
    Write-Host "Warnings: $warnings" -ForegroundColor Yellow
}

Write-Host ""

if ($failed -gt 0) {
    Write-Host "💡 Troubleshooting Tips:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1. Make sure the database has been seeded:" -ForegroundColor Yellow
    Write-Host "     .\seed-vercel.ps1 -SeedSecret 'YOUR_SECRET'" -ForegroundColor White
    Write-Host ""
    Write-Host "  2. Check Vercel environment variables are set:" -ForegroundColor Yellow
    Write-Host "     - DB (MongoDB connection string)" -ForegroundColor White
    Write-Host "     - JWT_SECRET" -ForegroundColor White
    Write-Host "     - SEED_SECRET" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. View detailed docs: VERCEL_LOGIN_FIX.md" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "🎉 All tests passed! Your login system is working correctly." -ForegroundColor Green
    Write-Host ""
}
