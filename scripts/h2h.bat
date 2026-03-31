@echo off
title H2H iRacing
echo.
echo   ==========================
echo     H2H iRacing Overlay
echo   ==========================
echo.
echo   Starting server...
echo   Do NOT close this window.
echo.

node.exe --env-file=.env src/server/server.ts

