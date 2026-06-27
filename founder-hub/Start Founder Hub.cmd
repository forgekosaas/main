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

echo Opening http://localhost:3030 ...
start "" "http://localhost:3030"
echo.
echo Keep this window open while using Founder Hub.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
