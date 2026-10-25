@echo off
title Online Real Estate Management System - React Frontend
echo ===================================================
echo Starting React Vite Frontend (Port 5173)...
echo ===================================================

if exist "C:\Users\HP\dev_tools\node-v20.18.0-win-x64" (
    set PATH=C:\Users\HP\dev_tools\node-v20.18.0-win-x64;%PATH%
)

cd frontend
npm run dev
pause
