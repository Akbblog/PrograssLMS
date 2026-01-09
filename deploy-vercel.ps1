# Deploys the Next.js frontend to Vercel from the repo root
# Usage (PowerShell):
#   ./deploy-vercel.ps1            # interactive; links project if needed
#   ./deploy-vercel.ps1 -Prod     # deploys to production
#   ./deploy-vercel.ps1 -Token <your_token>  # non-interactive using VERCEL_TOKEN
param(
    [switch]$Prod,
    [string]$Token,
    [string]$ProjectName,
    [switch]$RemoveOld,
    [switch]$SkipChecks
)

function Run-Command([string]$cmd){
    Write-Host "Running: $cmd"
    & cmd /c $cmd
    if ($LASTEXITCODE -ne 0) { throw "Command failed: $cmd" }
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)){
    Write-Host "npx not found. Install Node.js or run this from a shell with npx available." -ForegroundColor Yellow
}

# optional: login (will be skipped if token provided)
if (-not $Token) {
    Write-Host "Ensure you're logged into Vercel. If not, run: npx vercel login" -ForegroundColor Cyan
}

$cwdFlag = "--cwd frontend"
$confirmFlag = "--confirm"
$prodFlag = $Prod.IsPresent ? "--prod" : ""
$tokenFlag = $null
if ($Token) { $tokenFlag = "--token $Token" }


if ($ProjectName) {
    # Optionally remove existing Vercel project
    if ($RemoveOld.IsPresent) {
        $rmCmd = "npx vercel projects rm $ProjectName --yes $tokenFlag"
        Run-Command $rmCmd
    }

    # Create a project (vercel will create or link)
    $createCmd = "npx vercel projects create $ProjectName $tokenFlag"
    Run-Command $createCmd

    # Link the frontend directory to the project name (non-interactive)
    $linkCmd = "npx vercel link --name $ProjectName --cwd frontend $confirmFlag $tokenFlag"
    Run-Command $linkCmd
}

if (-not $SkipChecks.IsPresent) {
    Run-Command "npm --prefix frontend run verify"
}

$cmd = "npx vercel $cwdFlag $prodFlag $confirmFlag $tokenFlag"

Run-Command $cmd
