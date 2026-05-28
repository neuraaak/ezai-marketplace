@echo off
echo Regeneration du catalogue marketplace.json...
node "%~dp0build-index.js"
if %ERRORLEVEL% NEQ 0 (
  echo Erreur lors de la regeneration du catalogue.
  exit /b 1
)
