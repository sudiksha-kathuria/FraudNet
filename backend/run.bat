@echo off
REM Citizen Fraud Shield Backend - Development Run Script

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Setting up environment...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo NOTE: Please update .env with your Groq API key
    echo GROQ_API_KEY=your_api_key_here
    echo.
)

echo.
echo Starting Flask application...
echo Server will be available at http://localhost:8000
echo.

python app.py

pause
