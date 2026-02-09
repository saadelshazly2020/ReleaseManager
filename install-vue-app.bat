@echo off
echo Installing Vue Release Manager dependencies...
cd ClientApp\release-manager-vue
npm install --legacy-peer-deps
echo.
echo Installation complete!
echo.
echo To start the development server, run:
echo   cd ClientApp\release-manager-vue
echo   npm run dev
pause
