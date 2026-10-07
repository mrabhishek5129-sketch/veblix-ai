@echo off
:loop
echo [%date% %time%] Starting localtunnel...
call npx localtunnel --port 3000 --subdomain abhi-ai-builder
timeout /t 2 /nobreak >nul
goto loop
