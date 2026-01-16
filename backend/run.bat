@echo off
echo ================================================
echo Starting Brands Galaxy Backend Server
echo ================================================
echo.

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist .env (
    echo WARNING: .env file not found!
    echo Please create .env file with your configuration.
    pause
    exit /b 1
)

echo Starting FastAPI server...
echo.
echo Server will be available at:
echo   - Local: http://localhost:8000
echo   - API Docs: http://localhost:8000/api/docs
echo   - Health Check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
