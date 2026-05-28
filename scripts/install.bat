@echo off
setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: install.bat ^<plugin-name^> [destination]
    echo Exemple: install.bat skill-mon-plugin
    echo Exemple: install.bat skill-mon-plugin C:\mon-projet
    exit /b 1
)

set PLUGIN_NAME=%1
set DEST=%2
if "%DEST%"=="" set DEST=%CD%

set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%..
set PLUGIN_DIR=%REPO_ROOT%\plugins\%PLUGIN_NAME%
set AGENTS_DIR=%DEST%\.agents\%PLUGIN_NAME%

if not exist "%PLUGIN_DIR%" (
    echo Erreur : plugin "%PLUGIN_NAME%" introuvable dans plugins\
    echo Ouvrez .claude-plugin\marketplace.json pour voir les plugins disponibles.
    exit /b 1
)

echo Installation de %PLUGIN_NAME%...
if not exist "%AGENTS_DIR%" mkdir "%AGENTS_DIR%"

xcopy /s /e /y /q "%PLUGIN_DIR%\skills\*" "%AGENTS_DIR%\"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Plugin "%PLUGIN_NAME%" installe dans %AGENTS_DIR%
    echo.
) else (
    echo Erreur lors de la copie des fichiers.
    exit /b 1
)
