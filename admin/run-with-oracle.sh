#!/bin/bash
# Script to run the Spring Boot application with Oracle profile

echo "Starting application with Oracle profile..."
# Set Oracle environment variables
export ORACLE_HOST=localhost
export ORACLE_PORT=1521
export ORACLE_SERVICE=dbelearning
export ORACLE_USER=balti007
export ORACLE_PASSWORD=balti007

echo "Oracle configuration:"
echo "HOST: $ORACLE_HOST"
echo "PORT: $ORACLE_PORT" 
echo "SERVICE: $ORACLE_SERVICE"
echo "USER: $ORACLE_USER"

# Run the application with Oracle profile
mvn spring-boot:run -Dspring-boot.run.profiles=oracle -Dspring-boot.run.jvmArguments="-Dserver.port=5000"