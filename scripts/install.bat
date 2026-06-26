@echo off
setlocal enabledelayedexpansion

REM Fallback Windows sans Node : reproduit `ezai install`.
REM  install.bat  -> installe tous les plugins
REM  install.bat <plugin>  -> installe un seul plugin
REM  install.bat <plugin> <dest>
REM  install.bat "" <dest>  -> tous les plugins, destination personnalisee
REM
REM Decouverte par walk de plugins\experts\* et plugins\personas\* (le nom du
REM dossier = nom du plugin). Seuls SKILL.md + references\ sont copies, dans
REM <dest>\.agents\skills\<nom>, puis lies par junction vers les plateformes
REM installees (~\.claude, ~\.gemini, ~\.copilot).

set "PLUGIN_NAME=%~1"
set "DEST=%~2"
if "%DEST%"=="" set "DEST=%USERPROFILE%"

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "REPO_ROOT=%%~fI"
set "AGENTS_DIR=%DEST%\.agents\skills"
set "FOUND=0"

echo Installation depuis %REPO_ROOT%\plugins vers %AGENTS_DIR%
echo.

for /d %%P in ("%REPO_ROOT%\plugins\experts\*") do call :install_one "%%~nxP" "%%~fP"
for /d %%P in ("%REPO_ROOT%\plugins\personas\*") do call :install_one "%%~nxP" "%%~fP"

if "%FOUND%"=="0" (
  if not "%PLUGIN_NAME%"=="" (
    echo Erreur : plugin "%PLUGIN_NAME%" introuvable dans plugins\experts ou plugins\personas
    ) else (
    echo Erreur : aucun plugin trouve dans plugins\experts ou plugins\personas
  )
  exit /b 1
)

echo.
echo %FOUND% plugin(s) installe(s) dans %AGENTS_DIR%
exit /b 0

REM ---------------------------------------------------------------------------
REM :install_one <nom> <chemin-plugin>
:install_one
set "NAME=%~1"
set "PLUGIN_DIR=%~2"

REM Filtre si un nom precis a ete demande.
if not "%PLUGIN_NAME%"=="" if /i not "%NAME%"=="%PLUGIN_NAME%" exit /b 0

set "DEST_DIR=%AGENTS_DIR%\%NAME%"

echo Installation de %NAME%...

REM Purge prealable : une nouvelle version ne doit pas heriter d'anciens fichiers.
if exist "%DEST_DIR%" rmdir /s /q "%DEST_DIR%"
mkdir "%DEST_DIR%"

if exist "%PLUGIN_DIR%\SKILL.md" (
  copy /y "%PLUGIN_DIR%\SKILL.md" "%DEST_DIR%\" >nul
)
if exist "%PLUGIN_DIR%\references" (
  xcopy /s /e /y /q "%PLUGIN_DIR%\references" "%DEST_DIR%\references\" >nul
)

if not %ERRORLEVEL% EQU 0 (
  echo  Erreur lors de la copie de %NAME%.
  exit /b 1
)

set /a FOUND+=1

call :link_platforms "%NAME%" "%DEST_DIR%"
exit /b 0

REM ---------------------------------------------------------------------------
REM :link_platforms <nom> <source-junction>
:link_platforms
for %%D in (".claude" ".gemini" ".copilot") do call :link_one "%%~D" "%~1" "%~2"
exit /b 0

REM ---------------------------------------------------------------------------
REM :link_one <dossier-plateforme> <nom> <source-junction>
:link_one
set "PLAT=%DEST%\%~1"
if not exist "%PLAT%" exit /b 0

set "SKILLS=%PLAT%\skills"
if not exist "%SKILLS%" mkdir "%SKILLS%"
set "LINK=%SKILLS%\%~2"

if exist "%LINK%" (
  fsutil reparsepoint query "%LINK%" >nul 2>&1
  if !errorlevel! EQU 0 (
    rmdir "%LINK%"
    ) else (
    echo  [warn] %LINK% est un dossier reel, non remplace
    exit /b 0
  )
)

mklink /J "%LINK%" "%~3" >nul
if !errorlevel! EQU 0 (
  echo  lien %~1 -^> %LINK%
  ) else (
  echo  [warn] echec du lien %~1 pour %~2
)
exit /b 0
