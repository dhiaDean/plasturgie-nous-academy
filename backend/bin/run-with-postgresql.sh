#!/bin/bash
# Script to run the Spring Boot application with PostgreSQL profile

echo "Starting application with PostgreSQL profile..."
mvn spring-boot:run -Dspring-boot.run.profiles=postgresql -Dspring-boot.run.jvmArguments="-Dserver.port=5000 -Dserver.address=0.0.0.0"