@echo off
setlocal
set "TARGET=%~dp0Start Founder Hub.cmd"
set "SHORTCUT=%USERPROFILE%\Desktop\Founder Hub.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$shell = New-Object -ComObject WScript.Shell; $shortcut = $shell.CreateShortcut($env:SHORTCUT); $shortcut.TargetPath = $env:TARGET; $shortcut.WorkingDirectory = Split-Path $env:TARGET; $shortcut.IconLocation = 'shell32.dll,220'; $shortcut.Save()"

if errorlevel 1 (
  echo Could not create the desktop shortcut.
  pause
  exit /b 1
)

echo Created: %SHORTCUT%
pause
