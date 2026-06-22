@echo off
REM Start Both Frontend and Backend Services
REM Run this from the project root directory

echo.
echo ==========================================
echo  Citizen Fraud Shield - Full Stack Start
echo ==========================================
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo OK: Node.js installed

echo [2/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not installed. Please install Python 3.8+
    pause
    exit /b 1
)
echo OK: Python installed

echo.
echo ==========================================
echo Starting Services...
echo ==========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start Backend in new window
echo Starting Backend Server...
start "Citizen Fraud Shield - Backend" cmd /k "cd backend && python -m venv venv 2>nul && call venv\Scripts\activate && pip install -q -r requirements.txt 2>nul && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo Starting Frontend Server...
start "Citizen Fraud Shield - Frontend" cmd /k "npm install -q && npm run dev"

REM Wait for both to start
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo Services Starting Up...
echo ==========================================
echo.
echo Backend should be ready at:
echo   http://localhost:8000
echo   http://localhost:8000/health
echo.
echo Frontend should be ready at:
echo   http://localhost:5173
echo.
echo Verification:
echo   node verify-connection.js
echo.
echo This window will close in 10 seconds...
echo Press any key to close sooner.
echo.
timeout /t 10
