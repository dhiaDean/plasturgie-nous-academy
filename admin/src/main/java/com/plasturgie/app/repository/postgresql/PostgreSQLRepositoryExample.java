package com.plasturgie.app.repository.postgresql;

import com.plasturgie.app.model.Course;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Example repository with PostgreSQL-specific query optimizations and syntax.
 * This repository will only be active when the "postgresql" profile is active.
 */
@Repository
@Profile("postgresql")
public interface PostgreSQLRepositoryExample extends JpaRepository<Course, Long> {

    // Using JPQL queries instead of native SQL to avoid referencing non-existent tables
    // Native SQL queries will be implemented when the schema is fully established
    
    /**
     * Basic pagination example
     */
    List<Course> findByTitleContainingOrderByCreatedAtDesc(String keyword);
}