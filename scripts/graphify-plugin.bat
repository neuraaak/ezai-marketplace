@echo off
setlocal

set REPO_ROOT=%~dp0..
set PLUGINS_DIR=%REPO_ROOT%\plugins

if "%~1"=="" goto usage
if "%~1"=="--help" goto usage
if "%~1"=="-h" goto usage

set PLUGIN_NAME=%~1
set PLUGIN_DIR=%PLUGINS_DIR%\%PLUGIN_NAME%

if not exist "%PLUGIN_DIR%\" (
  echo Error: plugin '%PLUGIN_NAME%' not found in plugins\
  exit /b 1
)

cd /d "%PLUGIN_DIR%"
echo Running graphify on %PLUGIN_DIR% ...
graphify .
exit /b %ERRORLEVEL%

:usage
echo Usage: graphify-plugin.bat ^<plugin-name^>
echo.
echo Generates a graphify knowledge graph scoped to a single plugin.
echo Output is written to plugins\^<plugin-name^>\graphify-out\
echo.
echo Available plugins:
for /d %%D in ("%PLUGINS_DIR%\*") do echo  %%~nxD
exit /b 1
