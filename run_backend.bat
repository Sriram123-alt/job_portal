@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Starting Backend with Java 21...
cd backend
mvn spring-boot:run -DskipTests
pause
