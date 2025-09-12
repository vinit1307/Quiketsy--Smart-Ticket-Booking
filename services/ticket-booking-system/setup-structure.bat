@echo off
REM ===========================================
REM Auto-create package structure for Ticket Booking System
REM ===========================================

SET BASE_DIR=src\main\java\com\ticketbooking

echo Creating backend package structure...

REM Gateway Service
mkdir %BASE_DIR%\gateway\controller
mkdir %BASE_DIR%\gateway\service
mkdir %BASE_DIR%\gateway\model

REM User Service
mkdir %BASE_DIR%\user\controller
mkdir %BASE_DIR%\user\service
mkdir %BASE_DIR%\user\model

REM Ticket Service
mkdir %BASE_DIR%\ticket\controller
mkdir %BASE_DIR%\ticket\service
mkdir %BASE_DIR%\ticket\model

REM Payment Service
mkdir %BASE_DIR%\payment\controller
mkdir %BASE_DIR%\payment\service
mkdir %BASE_DIR%\payment\model

REM Resources folders
mkdir src\main\resources\static
mkdir src\main\resources\templates

echo.
echo Folder structure created successfully!
pause
