@echo off
REM Start Development Servers for Green Earth Credits
REM This batch file starts both the frontend (Vite) and backend (Express) servers

echo ==========================================
echo Green Earth Credits - Development Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

REM Install backend dependencies if needed
if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
    echo.
)

REM Create backend .env if it doesn't exist
if not exist "server\.env" (
    echo Creating server\.env from template...
    copy server\.env.example server\.env
    echo Created server\.env
    echo Please update with your Razorpay credentials if needed
    echo.
)

echo ==========================================
echo Starting Development Servers...
echo ==========================================
echo.
echo Starting Frontend on http://localhost:5173
echo Starting Backend on http://localhost:5000
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Start servers in separate windows
start "Frontend - Green Earth Credits" cmd /k "npm run dev"
cd server
start "Backend - Razorpay Server" cmd /k "npm run dev"
cd ..

echo.
echo Development servers started!
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
