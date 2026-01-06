param(
  [string]$Host = 'srv2027.hstgr.io',
  [int]$Port = 3306,
  [string]$User = 'u966438854_jk',
  [string]$Db = 'u966438854_LMS',
  [string]$SqlFile = 'prisma/migration_sql.sql'
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptDir
Set-Location ..

if (-not (Test-Path $SqlFile)) {
  Write-Error "SQL file not found: $SqlFile"
  Pop-Location
  exit 2
}

Write-Host "Importing $SqlFile into $User@$Host:$Db"
# You will be prompted for the MySQL password
& mysql -u $User -p -h $Host -P $Port $Db < $SqlFile

Write-Host "Installing backend dependencies (if missing) and generating Prisma client..."
npm install --no-audit --no-fund
npx prisma generate

Write-Host "Running Prisma seed..."
node prisma/seed.js

Pop-Location
