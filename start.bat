@echo off
echo Starting Clarivio...

start "Clarivio Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak >nul
start "Clarivio Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Both windows opened. Press any key to exit this launcher.
pause
