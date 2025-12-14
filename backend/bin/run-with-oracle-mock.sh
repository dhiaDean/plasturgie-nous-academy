#!/bin/bash
# Script to run the Spring Boot application with Oracle mock profile

echo "Starting application with Oracle mock profile (H2 with Oracle mode)..."
mvn spring-boot:run -Dspring-boot.run.profiles=oracle-mock -Dspring-boot.run.jvmArguments="-Dserver.port=5000"