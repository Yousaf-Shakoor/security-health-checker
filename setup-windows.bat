@echo off
setlocal
cd /d "%~dp0"
echo ================================================
echo Security Health Checker - Windows Setup
echo ================================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install Node.js 18 or newer, then run this file again.
  pause
  exit /b 1
)

echo Installing project dependencies...
npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Check your internet connection and try again.
  pause
  exit /b 1
)

echo.
echo Starting web app and API...
npm run dev:all
