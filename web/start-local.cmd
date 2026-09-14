@echo off
setlocal
cd /d "%~dp0"
if not exist dist\index.html (
  echo No build found. Running npm run build...
  call npm run build || exit /b 1
)
call npm run serve:local
