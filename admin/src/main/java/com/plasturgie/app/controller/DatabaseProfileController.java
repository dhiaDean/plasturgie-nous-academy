package com.plasturgie.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for displaying database profile information
 */
@RestController
@RequestMapping("/api/public/database")
public class DatabaseProfileController {

    @Autowired
    private Environment environment;

    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Value("${spring.profiles.active:default}")
    private String activeProfiles;

    @GetMapping("/info")
    public ResponseEntity<?> getDatabaseInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("activeProfiles", Arrays.toString(environment.getActiveProfiles()));
        
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            info.put("databaseProductName", metaData.getDatabaseProductName());
            info.put("databaseProductVersion", metaData.getDatabaseProductVersion());
            info.put("driverName", metaData.getDriverName());
            info.put("driverVersion", metaData.getDriverVersion());
            info.put("url", metaData.getURL());
            info.put("username", metaData.getUserName());
            info.put("schema", connection.getSchema());
            
        } catch (Exception e) {
            info.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(info);
    }
    
    @GetMapping("/tables")
    public ResponseEntity<Map<String, Object>> getTables() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // This query works for both PostgreSQL and Oracle
            String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA()";
            boolean isOracle = Arrays.toString(environment.getActiveProfiles()).contains("oracle");
            
            if (isOracle) {
                // Oracle specific query for user tables
                sql = "SELECT table_name FROM user_tables";
            }
            
            List<String> tables = jdbcTemplate.queryForList(sql, String.class);
            result.put("tables", tables);
            result.put("count", tables.size());
            result.put("activeProfiles", Arrays.toString(environment.getActiveProfiles()));
            
            // Additional diagnostic info for Oracle
            if (isOracle) {
                // Get database version
                try {
                    String versionSql = "SELECT * FROM v$version";
                    List<Map<String, Object>> versionInfo = jdbcTemplate.queryForList(versionSql);
                    result.put("oracle_version", versionInfo);
                } catch (Exception e) {
                    result.put("version_error", e.getMessage());
                }
                
                // Get current schema
                try {
                    String schemaSql = "SELECT SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') FROM dual";
                    String currentSchema = jdbcTemplate.queryForObject(schemaSql, String.class);
                    result.put("current_schema", currentSchema);
                } catch (Exception e) {
                    result.put("schema_error", e.getMessage());
                }
                
                // If tables are missing, try different queries
                if (tables.size() < 12) {
                    // Try with all_tables
                    try {
                        String altSql = "SELECT table_name FROM all_tables WHERE owner = USER";
                        List<String> altTables = jdbcTemplate.queryForList(altSql, String.class);
                        result.put("alt_tables", altTables);
                        result.put("alt_count", altTables.size());
                    } catch (Exception e) {
                        result.put("alt_error", e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("error_type", e.getClass().getName());
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/sequences")
    public ResponseEntity<Map<String, Object>> getSequences() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Query for PostgreSQL
            String sql = "SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = CURRENT_SCHEMA()";
            boolean isOracle = Arrays.toString(environment.getActiveProfiles()).contains("oracle");
            
            if (isOracle) {
                // Enhanced Oracle specific query to include all user sequences
                sql = "SELECT sequence_name FROM user_sequences";
            }
            
            List<String> sequences = jdbcTemplate.queryForList(sql, String.class);
            result.put("sequences", sequences);
            result.put("count", sequences.size());
            result.put("activeProfiles", Arrays.toString(environment.getActiveProfiles()));
            
            // If Oracle, include additional info about sequence validation
            if (isOracle && sequences.isEmpty()) {
                // Try with different query to validate
                try {
                    String validationSql = "SELECT sequence_name FROM all_sequences WHERE sequence_owner = USER";
                    List<String> altSequences = jdbcTemplate.queryForList(validationSql, String.class);
                    result.put("validation_sequences", altSequences);
                    result.put("validation_count", altSequences.size());
                } catch (Exception e) {
                    result.put("validation_error", e.getMessage());
                }
                
                // Get all objects owned by user for debugging
                try {
                    String objectsSql = "SELECT object_name, object_type FROM user_objects ORDER BY object_type";
                    List<Map<String, Object>> objects = jdbcTemplate.queryForList(objectsSql);
                    result.put("user_objects", objects);
                } catch (Exception e) {
                    result.put("objects_error", e.getMessage());
                }
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("error_type", e.getClass().getName());
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/oracle-sequences")
    public ResponseEntity<Map<String, Object>> getOracleSequences() {
        Map<String, Object> result = new HashMap<>();
        boolean isOracle = Arrays.toString(environment.getActiveProfiles()).contains("oracle");
        result.put("isOracleProfile", isOracle);
        
        if (!isOracle) {
            result.put("message", "This endpoint is only available when running with Oracle profile");
            return ResponseEntity.ok(result);
        }
        
        // List of expected sequences
        List<String> expectedSequences = Arrays.asList(
            "USER_SEQ", "COMPANY_SEQ", "SERVICE_SEQ", "COURSE_SEQ", 
            "INSTRUCTOR_SEQ", "ENROLLMENT_SEQ", "REVIEW_SEQ", 
            "PAYMENT_SEQ", "CERTIFICATION_SEQ", "EVENT_SEQ", 
            "EVENT_REGISTRATION_SEQ"
        );
        result.put("expectedSequences", expectedSequences);
        
        try {
            // Query all sequences owned by the current user
            String sql = "SELECT sequence_name FROM user_sequences";
            List<String> sequences = jdbcTemplate.queryForList(sql, String.class);
            result.put("foundSequences", sequences);
            result.put("count", sequences.size());
            
            // Check which sequences are missing
            List<String> missingSequences = new java.util.ArrayList<>(expectedSequences);
            missingSequences.removeAll(sequences);
            result.put("missingSequences", missingSequences);
            
            // Get detailed sequence information
            if (!sequences.isEmpty()) {
                String detailSql = "SELECT sequence_name, min_value, max_value, " +
                                   "increment_by, last_number, cache_size " +
                                   "FROM user_sequences";
                List<Map<String, Object>> sequenceDetails = jdbcTemplate.queryForList(detailSql);
                result.put("sequenceDetails", sequenceDetails);
            }
            
            // Get user privileges related to sequences
            try {
                String privSql = "SELECT * FROM user_sys_privs WHERE privilege LIKE '%SEQUENCE%'";
                List<Map<String, Object>> sequencePrivileges = jdbcTemplate.queryForList(privSql);
                result.put("sequencePrivileges", sequencePrivileges);
            } catch (Exception e) {
                result.put("privilegeError", e.getMessage());
            }
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("error_type", e.getClass().getName());
        }
        
        return ResponseEntity.ok(result);
    }
}