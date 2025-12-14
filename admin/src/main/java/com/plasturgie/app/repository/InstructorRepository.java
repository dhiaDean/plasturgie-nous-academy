package com.plasturgie.app.repository;

import com.plasturgie.app.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    // Find instructor by their associated User's ID
    @Query("SELECT i FROM Instructor i LEFT JOIN FETCH i.user u WHERE u.userId = :userId")
    Optional<Instructor> findByUserId(@Param("userId") Long userId);

    // Optional: to fetch instructor with their specific reviews if needed often
    @Query("SELECT i FROM Instructor i LEFT JOIN FETCH i.reviews r WHERE i.instructorId = :instructorId")
    Optional<Instructor> findByIdWithReviews(@Param("instructorId") Long instructorId);
    
    
    
 // For InstructorServiceImpl search methods
    List<Instructor> findByExpertiseContainingIgnoreCase(String expertise);
    List<Instructor> findByRatingGreaterThanEqual(BigDecimal rating);

    // Optional: to ensure User is fetched for DTO conversion in getAllInstructorsForList
    @Query("SELECT DISTINCT i FROM Instructor i LEFT JOIN FETCH i.user")
    List<Instructor> findAllWithUserDetails();

 
}