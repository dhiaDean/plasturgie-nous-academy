-- Oracle initialization script
-- This script creates the necessary user/schema for the application
-- Make sure to run this with DBA privileges (e.g., as SYSTEM or SYS)

-- Replace 'plasturgieapp' with your preferred username
-- Replace 'YourStrongPassword' with a secure password
-- Replace 'ORCLPDB' with your Oracle service name if different

-- Create user
CREATE USER plasturgieapp IDENTIFIED BY YourStrongPassword
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON users;

-- Grant necessary privileges
GRANT CONNECT, RESOURCE TO plasturgieapp;
GRANT CREATE SESSION TO plasturgieapp;
GRANT CREATE TABLE TO plasturgieapp;
GRANT CREATE VIEW TO plasturgieapp;
GRANT CREATE SEQUENCE TO plasturgieapp;
GRANT CREATE PROCEDURE TO plasturgieapp;
GRANT CREATE TRIGGER TO plasturgieapp;
GRANT CREATE TYPE TO plasturgieapp;

-- Then, connect as the new user
-- CONNECT plasturgieapp/YourStrongPassword@ORCLPDB

-- After connecting as the new user, run the oracle-sequences.sql script
-- to create all the necessary sequences