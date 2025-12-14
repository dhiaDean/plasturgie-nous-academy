package com.plasturgie.app.repository;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.enums.Mode;

// Remove EntityGraph import if not used directly on derived query names after this cleanup
// import org.springframework.data.jpa.repository.EntityGraph; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // For fetching a list of courses with common details
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.instructors ins LEFT JOIN FETCH ins.user " +
           "LEFT JOIN FETCH c.reviews course_rev LEFT JOIN FETCH course_rev.user " +
           "LEFT JOIN FETCH c.enrollments enr LEFT JOIN FETCH enr.user " +
           "LEFT JOIN FETCH c.modules " + // Ensure modules are fetched
           "ORDER BY c.createdAt DESC")
    List<Course> findAllWithDetails();

    // For fetching a single course with all necessary details for DTO mapping
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.instructors ins LEFT JOIN FETCH ins.user " +
           "LEFT JOIN FETCH c.reviews course_rev LEFT JOIN FETCH course_rev.user " +
           "LEFT JOIN FETCH c.enrollments enr LEFT JOIN FETCH enr.user " +
           "LEFT JOIN FETCH c.modules " + // Ensure modules are fetched
           // You might want to add LEFT JOIN FETCH for c.practicalSessions here if needed by DTO
           "WHERE c.courseId = :courseId")
    Optional<Course> findByIdWithDetails(@Param("courseId") Long courseId);


    // For fetching courses by a specific instructor with details
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.instructors ins LEFT JOIN FETCH ins.user " +
           "LEFT JOIN FETCH c.reviews course_rev LEFT JOIN FETCH course_rev.user " +
           "LEFT JOIN FETCH c.enrollments enr LEFT JOIN FETCH enr.user " +
           "LEFT JOIN FETCH c.modules " + // Ensure modules are fetched
           "WHERE ins.instructorId = :instructorId " +
           "ORDER BY c.createdAt DESC")
    List<Course> findByInstructorIdWithDetails(@Param("instructorId") Long instructorId);
    
    // Removed the problematic findByIdWithDetails1 method

    // Standard derived queries (these will not eagerly fetch collections unless specified by default in entity)
    List<Course> findByCategory(String category);
    List<Course> findByMode(Mode mode);
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByCertificationEligible(Boolean certificationEligible);
    List<Course> findByPriceLessThanEqual(BigDecimal maxPrice);
}