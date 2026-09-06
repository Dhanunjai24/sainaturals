@echo off
title Sri Sai Natural Foods Launcher
echo ======================================================
echo    Starting Sri Sai Natural Foods Platform...
echo ======================================================

echo [1/2] Starting Backend API Server (Port 5000)...
start "Sri Sai Naturals - Backend API" cmd /k "cd backend && npm start"

timeout /t 2 >nul

echo [2/2] Starting Frontend Web Store (Port 3001)...
start "Sri Sai Naturals - Frontend Store" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul

echo Opening browser at http://localhost:3001 ...
start http://localhost:3001

echo.
echo All services launched!
echo - Store Website: http://localhost:3001
echo - Backend API:   http://localhost:5000/api
echo.
pause
