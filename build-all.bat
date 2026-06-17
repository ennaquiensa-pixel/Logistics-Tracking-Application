@echo off
REM ============================================
REM  Script de build de tous les services Livrago
REM  Lance: build-all.bat
REM ============================================

set MVN=C:\Users\u1602\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin\mvn.cmd
set BASE=C:\Users\u1602\Documents\S7\Programmation JEE\projet\livrago

echo ========================================
echo  Building all Livrago microservices...
echo ========================================

for %%S in (discovery-service api-gateway user-service order-service delivery-service warehouse-service notification-service product-service route-service tracking-service) do (
  echo.
  echo [%%S] Building...
  "%MVN%" clean package -DskipTests -f "%BASE%\%%S\pom.xml"
  if errorlevel 1 (
    echo [%%S] BUILD FAILED!
    exit /b 1
  )
  echo [%%S] OK
)

echo.
echo ========================================
echo  All services built successfully!
echo  You can now run: docker-compose up --build
echo ========================================
