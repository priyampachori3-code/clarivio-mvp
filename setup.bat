@echo off
echo ========================================
echo   Clarivio — First-time Setup
echo ========================================

echo.
echo [1/4] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
deactivate
cd ..

echo.
echo [2/4] Setting up Node frontend...
cd frontend
npm install
cd ..

echo.
echo ========================================
echo   Setup complete!
echo   Run start.bat to launch Clarivio.
echo ========================================
pause
