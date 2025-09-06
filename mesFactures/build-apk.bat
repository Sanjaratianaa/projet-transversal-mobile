@echo off
echo Building Ionic APK using Docker...
echo.

REM Build the Docker image
echo [1/3] Building Docker image...
docker build -t ionic-apk-builder .

if %ERRORLEVEL% neq 0 (
    echo Error: Docker build failed!
    pause
    exit /b 1
)

echo [2/3] Creating temporary container to extract APK...
docker create --name ionic-temp-container ionic-apk-builder

if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create container!
    pause
    exit /b 1
)

echo [3/3] Copying APK to current directory...
docker cp ionic-temp-container:/output/app-debug.apk ./app-debug.apk

if %ERRORLEVEL% neq 0 (
    echo Error: Failed to copy APK!
    docker rm ionic-temp-container
    pause
    exit /b 1
)

REM Clean up
echo Cleaning up...
docker rm ionic-temp-container
docker rmi ionic-apk-builder

echo.
echo ========================================
echo SUCCESS! APK created: app-debug.apk
echo ========================================
echo.
echo You can now install this APK on your Android device.
echo.
pause