@echo off
title Clinic Square - Localhost Setup
echo ==============================
echo Starting Clinic Square Project
echo ==============================

:: Start MongoDB
echo Starting MongoDB...
start "" mongod

:: Start Backend
echo Starting Backend...
cd Clinic-Square-APIs-main
call npm install
start cmd /k "npm start"
cd ..

:: Start Frontend
echo Starting Frontend...
cd Clinic-Square-Frontend-main
call npm install
start cmd /k "npm run dev"
cd ..

:: Start Admin Panel
echo Starting Admin Panel...
cd Clinic-Square-Admin-main
call npm install
start cmd /k "npm run dev"
cd ..

echo ==============================
echo All Services Started Successfully!
echo ==============================
pause
