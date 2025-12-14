# Oracle Migration Notes

## Changes Required to Migrate from PostgreSQL to Oracle

### 1. Database Driver and Configuration

- Changed database driver from PostgreSQL to Oracle JDBC driver in `pom.xml`
- Updated database connection properties in `application.properties`
- Modified Hibernate dialect to Oracle12cDialect

### 2. Entity Modifications

- Updated ID generation strategies from `IDENTITY` to `SEQUENCE` with SequenceGenerator
- Oracle sequences need to be created manually or through JPA

### 3. SQL Syntax Differences

#### Data Types
- `TEXT` columns should be replaced with `CLOB` or `VARCHAR2(4000)`
- `BOOLEAN` types should be replaced with `NUMBER(1)` or `CHAR(1)`
- `TIMESTAMP` should be used with care as Oracle handles dates differently

#### Query Modifications
- Oracle uses `DUAL` for single-row queries
- Oracle pagination syntax differs from PostgreSQL
- Oracle doesn't support `LIMIT`/`OFFSET`, use `ROWNUM` or `ROW_NUMBER()` instead
- Case sensitivity differs in Oracle (object names are uppercase by default)

### 4. Schema Ownership

- Oracle requires explicit schema specification
- Object names are case-sensitive differently from PostgreSQL

### 5. Initial Setup Requirements

- Create or specify a dedicated Oracle schema/user for the application
- Create needed sequences for ID generation:
  ```sql
  CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE course_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE enrollment_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE instructor_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE certification_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE company_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE service_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE event_seq START WITH 1 INCREMENT BY 1;
  CREATE SEQUENCE review_seq START WITH 1 INCREMENT BY 1;
  ```
  
### 6. Transaction and Connection Management

- Different transaction isolation levels
- Connection pool configurations may need adjustments