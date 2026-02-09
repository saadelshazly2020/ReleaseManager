@echo off
echo ================================================
echo Release Manager Vue - Quick Start Verification
echo ================================================
echo.

echo Step 1: Checking if .NET API is running...
echo Please ensure the .NET API is running on https://localhost:7295
echo.
echo Step 2: Testing API connection...
curl -k https://localhost:7295/api/projects > nul 2>&1
if %errorlevel% equ 0 (
    echo ? API is responding!
) else (
    echo ? API is not responding. Please start the .NET API first.
    echo   Run: dotnet run
    pause
    exit /b 1
)

echo.
echo Step 3: Starting Vue app...
cd ClientApp\release-manager-vue
echo.
echo The Vue app will start on: http://localhost:5174
echo The API proxy will connect to: https://localhost:7295/api
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev
