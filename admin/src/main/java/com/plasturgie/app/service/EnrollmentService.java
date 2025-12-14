package com.plasturgie.app.service;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Enrollment;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for managing enrollments
 */
public interface EnrollmentService {
    /**
     * Create a new enrollment
     * 
     * @param userId The user ID
     * @param courseId The course ID
     * @return The created enrollment
     */
    Enrollment createEnrollment(Long userId, Long courseId);
    
    /**
     * Create a new enrollment with payment
     * 
     * @param userId The user ID
     * @param courseId The course ID
     * @param paymentId The payment ID
     * @return The created enrollment
     */
    Enrollment createEnrollmentWithPayment(Long userId, Long courseId, Long paymentId);
    
    /**
     * Get an enrollment by ID
     * 
     * @param id The enrollment ID
     * @return The enrollment with the given ID
     */
    Enrollment getEnrollmentById(Long id);
    
    /**
     * Get enrollment by user and course
     * 
     * @param user The user
     * @param course The course
     * @return The enrollment for the given user and course
     */
    Enrollment getEnrollmentByUserAndCourse(User user, Course course);
    
    /**
     * Get enrollments by user
     * 
     * @param user The user
     * @return List of enrollments for the given user
     */
    List<Enrollment> getEnrollmentsByUser(User user);
    
    /**
     * Get enrollments by course
     * 
     * @param course The course
     * @return List of enrollments for the given course
     */
    List<Enrollment> getEnrollmentsByCourse(Course course);
    
    /**
     * Get enrollments by status
     * 
     * @param status The enrollment status
     * @return List of enrollments with the given status
     */
    List<Enrollment> getEnrollmentsByStatus(Status status);
    
    /**
     * Get enrollments by user and status
     * 
     * @param user The user
     * @param status The enrollment status
     * @return List of enrollments for the given user with the given status
     */
    List<Enrollment> getEnrollmentsByUserAndStatus(User user, Status status);
    
    /**
     * Update enrollment status
     * 
     * @param id The enrollment ID
     * @param status The new status
     * @return The updated enrollment
     */
    Enrollment updateEnrollmentStatus(Long id, Status status);
    
    /**
     * Complete an enrollment
     * 
     * @param id The enrollment ID
     * @param completionDate The completion date
     * @return The updated enrollment
     */
    Enrollment completeEnrollment(Long id, LocalDateTime completionDate);
    
    /**
     * Associate a payment with an enrollment
     * 
     * @param enrollmentId The enrollment ID
     * @param payment The payment
     * @return The updated enrollment
     */
    Enrollment addPaymentToEnrollment(Long enrollmentId, Payment payment);
    
    /**
     * Delete an enrollment
     * 
     * @param id The ID of the enrollment to delete
     */
    void deleteEnrollment(Long id);
}
