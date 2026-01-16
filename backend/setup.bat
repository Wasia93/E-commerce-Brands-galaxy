@echo off
echo ================================================
echo Brands Galaxy Backend Setup
echo ================================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo Virtual environment created successfully!
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate
echo.

echo Step 3: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 4: Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Step 5: Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update it with your configuration.
    echo.
    echo IMPORTANT: Update the following in .env:
    echo   - DATABASE_URL
    echo   - SECRET_KEY
    echo   - STRIPE keys
) else (
    echo .env file already exists.
)
echo.

echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Update .env file with your configuration
echo 2. Create PostgreSQL database: brands_galaxy
echo 3. Run the server: uvicorn app.main:app --reload
echo.
echo To activate the virtual environment in future sessions:
echo   venv\Scripts\activate
echo.
pause
