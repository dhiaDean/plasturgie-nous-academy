-- Oracle sequences for entity ID generation
-- Run this script when initializing the Oracle database

-- User sequence
CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;

-- Company sequence
CREATE SEQUENCE company_seq START WITH 1 INCREMENT BY 1;

-- Course sequence
CREATE SEQUENCE course_seq START WITH 1 INCREMENT BY 1;

-- Instructor sequence
CREATE SEQUENCE instructor_seq START WITH 1 INCREMENT BY 1;

-- Event sequence
CREATE SEQUENCE event_seq START WITH 1 INCREMENT BY 1;

-- Payment sequence
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;

-- Enrollment sequence
CREATE SEQUENCE enrollment_seq START WITH 1 INCREMENT BY 1;

-- Service sequence
CREATE SEQUENCE service_seq START WITH 1 INCREMENT BY 1;

-- Review sequence
CREATE SEQUENCE review_seq START WITH 1 INCREMENT BY 1;

-- Certification sequence
CREATE SEQUENCE certification_seq START WITH 1 INCREMENT BY 1;

-- ImageUser sequence (Added based on ImageUser entity configuration)
CREATE SEQUENCE image_user_seq START WITH 1 INCREMENT BY 1;

-- Optional: Consider adding NOCACHE to align closely with allocationSize=1, e.g.:
-- CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1 NOCACHE;
-- CREATE SEQUENCE image_user_seq START WITH 1 INCREMENT BY 1 NOCACHE;
-- etc... (This avoids larger ID gaps if an app instance restarts, but might have minor performance impact vs default caching)