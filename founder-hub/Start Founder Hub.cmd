@echo off
setlocal
cd /d "%~dp0"

title Founder Hub Local Server
echo Founder Hub local server
echo Folder: %CD%
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found in PATH. Open this from a terminal where Node.js is available.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

set "PORT=3030"
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-NetConnection 127.0.0.1 -Port 3030 -InformationLevel Quiet) { exit 1 }"
if errorlevel 1 set "PORT=3031"

echo Opening http://127.0.0.1:%PORT% ...
start "" "http://127.0.0.1:%PORT%"
echo.
echo Keep this window open while using Founder Hub.
echo Press Ctrl+C to stop the server.
echo.
call npx next dev -p %PORT%
pause
