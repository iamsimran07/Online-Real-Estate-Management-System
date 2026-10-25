@echo off
title Online Real Estate Management System - Spring Boot Backend
echo ===================================================
echo Starting Spring Boot Backend (Port 8080)...
echo ===================================================

if exist "C:\Users\HP\dev_tools\jdk-21.0.5+11" (
    if "%JAVA_HOME%"=="" set JAVA_HOME=C:\Users\HP\dev_tools\jdk-21.0.5+11
    set PATH=C:\Users\HP\dev_tools\apache-maven-3.9.9\bin;C:\Users\HP\dev_tools\jdk-21.0.5+11\bin;%PATH%
)

:: Auto-load environment variables from .env if present
if exist ".env" (
    echo [INFO] Loading environment variables from root .env...
    for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
        if not "%%A"=="" set "%%A=%%B"
    )
) else if exist "backend\.env" (
    echo [INFO] Loading environment variables from backend\.env...
    for /f "usebackq eol=# tokens=1,* delims==" %%A in ("backend\.env") do (
        if not "%%A"=="" set "%%A=%%B"
    )
)

cd backend
mvn spring-boot:run
pause
