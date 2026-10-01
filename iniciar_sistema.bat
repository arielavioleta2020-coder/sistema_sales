@echo off
TITLE SISTEMA_SALES S.A. - Lanzador del Sistema en React y MySQL
chcp 65001 > nul
cls
echo =========================================================================
echo   INSTITUTO SUPERIOR TECNOLÓGICO JAPÓN - PROYECTO DE TITULACIÓN
echo   SISTEMA DE INFORMACIÓN SISTEMA_SALES S.A. EN REACT Y MYSQL WORKBENCH
echo =========================================================================
echo.
echo [1/3] Abriendo la aplicación en su navegador...
start "" "%~dp0frontend\index.html"
echo.
echo [2/3] Base de datos MySQL Workbench:
echo   - Script SQL listo en: database\sistema_sales_mysql.sql
echo   - Para cargar: Abra MySQL Workbench -> File -> Open SQL Script -> Ejecutar.
echo.
echo [3/3] Aplicación React (Código fuente en carpeta react_app):
echo   - Para iniciar el servidor de desarrollo Vite con React:
echo       cd react_app
echo       npm install
echo       npm run dev
echo.
echo   - Para iniciar el Backend Node.js conectado a MySQL:
echo       cd backend_node
echo       npm install
echo       npm start
echo.
echo =========================================================================
echo ¡Proyecto listo para su revisión y evaluación en Visual Studio Code!
echo =========================================================================
pause
