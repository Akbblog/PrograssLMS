# Seed Vercel Database Script
# This script sends a POST request to seed your Vercel database with demo data

param(
    [Parameter(Mandatory=$false)]
    [string]$SeedSecret = "",
    
    [Parameter(Mandatory=$false)]
    [string]$VercelUrl = "https://progresslms-backend.vercel.app"
)

# Check if SEED_SECRET is provided
if ([string]::IsNullOrWhiteSpace($SeedSecret)) {
    Write-Host "❌ Error: SEED_SECRET is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\seed-vercel.ps1 -SeedSecret 'your-secret-key'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or set it as an environment variable:" -ForegroundColor Yellow
    Write-Host "  `$env:SEED_SECRET = 'your-secret-key'" -ForegroundColor Cyan
    Write-Host "  .\seed-vercel.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "🌱 Seeding Vercel Database..." -ForegroundColor Green
Write-Host "📍 URL: $VercelUrl/api/v1/seed" -ForegroundColor Cyan
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $SeedSecret"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod `
        -Uri "$VercelUrl/api/v1/seed" `
        -Method POST `
        -Headers $headers `
        -TimeoutSec 60
    
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.success) {
        Write-Host "📊 Seed Results:" -ForegroundColor Yellow
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
        Write-Host ""
        Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  Superadmin:" -ForegroundColor Yellow
        Write-Host "    Email:    SA@progresslms.com"
        Write-Host "    Password: Superpass"
        Write-Host ""
        Write-Host "  School Admin:" -ForegroundColor Yellow
        Write-Host "    Email:    admin@alnoor-academy.edu"
        Write-Host "    Password: admin123"
        Write-Host ""
        Write-Host "  Teachers:" -ForegroundColor Yellow
        Write-Host "    Email:    hassan.rashid@islamic-school.edu (or any teacher)"
        Write-Host "    Password: teacher123"
        Write-Host ""
        Write-Host "  Students:" -ForegroundColor Yellow
        Write-Host "    Email:    amr.abdullah@islamic-school.edu (or any student)"
        Write-Host "    Password: student123"
        Write-Host ""
    }
    
} catch {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "💡 Tip: Check that your SEED_SECRET matches the one set in Vercel environment variables" -ForegroundColor Cyan
        }
    }
    
    exit 1
}
