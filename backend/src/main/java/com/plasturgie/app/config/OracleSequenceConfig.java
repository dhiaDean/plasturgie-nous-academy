package com.plasturgie.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;

/**
 * Configuration class for Oracle sequence management
 * This class ensures all necessary sequences are explicitly created in Oracle
 */
@Configuration
@Profile("oracle")
public class OracleSequenceConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private Environment environment;
    
    /**
     * List of all sequence names used in the application
     */
    private final List<String> sequences = Arrays.asList(
            "USER_SEQ", 
            "COMPANY_SEQ", 
            "SERVICE_SEQ", 
            "COURSE_SEQ", 
            "INSTRUCTOR_SEQ", 
            "ENROLLMENT_SEQ", 
            "REVIEW_SEQ", 
            "PAYMENT_SEQ", 
            "CERTIFICATION_SEQ", 
            "EVENT_SEQ", 
            "EVENT_REGISTRATION_SEQ"
    );
    
    /**
     * Initialize sequences after bean construction
     */
    @PostConstruct
    public void initSequences() {
        if (Arrays.toString(environment.getActiveProfiles()).contains("oracle")) {
            for (String sequence : sequences) {
                createSequenceIfNotExists(sequence);
            }
        }
    }
    
    /**
     * Creates a sequence if it doesn't already exist
     * 
     * @param sequenceName The name of the sequence to create
     */
    private void createSequenceIfNotExists(String sequenceName) {
        try {
            // Check if sequence exists
            String checkSql = "SELECT COUNT(*) FROM user_sequences WHERE sequence_name = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, sequenceName);
            
            if (count != null && count == 0) {
                // Create sequence with appropriate options for ID generation
                String createSql = "CREATE SEQUENCE " + sequenceName + 
                                   " START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE";
                jdbcTemplate.execute(createSql);
                System.out.println("Created Oracle sequence: " + sequenceName);
            }
        } catch (Exception e) {
            System.err.println("Error creating sequence " + sequenceName + ": " + e.getMessage());
        }
    }
}