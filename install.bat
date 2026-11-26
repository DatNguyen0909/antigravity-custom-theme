@echo off
set ELECTRON_RUN_AS_NODE=1
"%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" "%~dp0build_bundle.js"
"%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" "%~dp0repack_asar.js"
echo =======================================================
echo   SUCCESS! Antigravity Custom Theme Installed!
echo =======================================================
pause
