@echo off
REM School Management System - Quick Start Script
echo.
echo ╔════════════════════════════════════════════╗
echo ║   School Management System (LMS)           ║
echo ║   Multi-Tenant SaaS Platform               ║
echo ╚════════════════════════════════════════════╝
echo.
echo Choose what to start:
echo [1] Start Backend (Express on :5130)
echo [2] Start Frontend (Next.js on :3000)
echo [3] Start Both (requires 2 terminals)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting Backend...
    cd backend
    npm run dev
) else if "%choice%"=="2" (
    echo Starting Frontend...
    npm --prefix frontend run dev
) else if "%choice%"=="3" (
    echo.
    echo Starting both services...
    echo [Terminal 1] Starting Backend on http://localhost:5130
    start cmd /k "cd backend && npm run dev"
    echo.
    timeout /t 3
    echo [Terminal 2] Starting Frontend on http://localhost:3000
    start cmd /k "npm --prefix frontend run dev"
    echo.
    echo ✓ Both services started!
    echo   - Backend:  http://localhost:5130
    echo   - Frontend: http://localhost:3000
) else (
    echo Invalid choice!
    pause
)
