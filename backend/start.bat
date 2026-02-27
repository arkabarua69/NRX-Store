@echo off
REM Game Top-Up Backend Startup Script for Windows

echo 🚀 Starting Game Top-Up Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit .env with your Supabase credentials before running again!
    exit /b 1
)

REM Run the application
echo ✅ Starting Flask server...
python run.py
