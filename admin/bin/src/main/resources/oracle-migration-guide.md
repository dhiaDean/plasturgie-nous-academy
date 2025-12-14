# Oracle Migration Guide

This document outlines the steps taken to migrate the Plasturgie application from PostgreSQL to Oracle database.

## Database Configuration Changes

1. Added Oracle JDBC driver dependency in `pom.xml`
2. Created separate application profiles:
   - `application-postgresql.properties` - PostgreSQL specific configuration
   - `application-oracle.properties` - Oracle specific configuration
   - Updated main `application.properties` to use profiles

## Entity Modifications for Oracle Compatibility

### ID Generation Strategy
Changed ID generation strategy from `IDENTITY` (PostgreSQL) to `SEQUENCE` (Oracle):

```java
// PostgreSQL version
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// Oracle version
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
private Long id;
```

### Data Type Mapping

| PostgreSQL | Oracle | Java Type |
|------------|--------|-----------|
| TEXT       | CLOB   | String    |
| BYTEA      | BLOB   | byte[]    |
| TIMESTAMP  | TIMESTAMP | LocalDateTime |
| BOOLEAN    | NUMBER(1) | Boolean |

Example of `@Lob` annotation for text fields:

```java
// PostgreSQL version
@Column(columnDefinition = "TEXT")
private String description;

// Oracle version
@Lob
private String description;
```

## Oracle Sequence Management

Created `oracle-sequences.sql` script to initialize all required sequences:
- user_seq
- company_seq
- course_seq
- instructor_seq
- event_seq
- payment_seq
- enrollment_seq
- service_seq
- review_seq
- certification_seq

This script needs to be executed when setting up a new Oracle database instance.

## Running the Application

- Use `./run-with-postgresql.sh` to run with PostgreSQL
- Use `./run-with-oracle.sh` to run with Oracle

## Environment Variables

### PostgreSQL Environment Variables
- PGHOST
- PGPORT
- PGDATABASE
- PGUSER
- PGPASSWORD
- DATABASE_URL

### Oracle Environment Variables
- ORACLE_HOST
- ORACLE_PORT
- ORACLE_SERVICE
- ORACLE_USER
- ORACLE_PASSWORD