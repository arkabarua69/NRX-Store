@echo off
REM Nrx Store - Vercel Setup Script for Windows
REM This script helps you set up environment variables for Vercel deployment

echo ========================================
echo Nrx Store - Vercel Setup Script
echo ========================================
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo Step 1: Supabase Configuration
echo ================================
set /p SUPABASE_URL="Enter your Supabase URL: "
set /p SUPABASE_ANON_KEY="Enter your Supabase Anon Key: "

echo.
echo Step 2: Backend API Configuration
echo ==================================
set /p API_URL="Enter your Backend API URL (e.g., https://your-app.railway.app/api): "

echo.
echo Step 3: Setting up Vercel environment variables...
cd frontend

REM Set environment variables in Vercel
echo %SUPABASE_URL% | vercel env add VITE_SUPABASE_URL production
echo %SUPABASE_ANON_KEY% | vercel env add VITE_SUPABASE_ANON_KEY production
echo %API_URL% | vercel env add VITE_API_URL production

echo.
echo Environment variables set successfully!
echo.
echo Step 4: Creating local .env file...

(
echo VITE_SUPABASE_URL=%SUPABASE_URL%
echo VITE_SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo VITE_API_URL=%API_URL%
) > .env

echo Local .env file created!
echo.
echo Step 5: Ready to deploy!
echo.
echo Run these commands to deploy:
echo   cd frontend
echo   vercel --prod
echo.
echo Setup complete!
pause
