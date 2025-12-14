package com.plasturgie.app.service;

import com.plasturgie.app.model.Certification;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.User;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for managing certifications
 */
public interface CertificationService {
    /**
     * Create a new certification
     * 
     * @param userId The user ID
     * @param courseId The course ID
     * @param issueDate The issue date
     * @param expiryDate The expiry date (optional)
     * @return The created certification
     */
    Certification createCertification(Long userId, Long courseId, LocalDateTime issueDate, LocalDateTime expiryDate);
    
    /**
     * Get a certification by ID
     * 
     * @param id The certification ID
     * @return The certification with the given ID
     */
    Certification getCertificationById(Long id);
    
    /**
     * Get a certification by certificate code
     * 
     * @param certificateCode The certificate code
     * @return The certification with the given code
     */
    Certification getCertificationByCode(String certificateCode);
    
    /**
     * Get certifications by user
     * 
     * @param user The user
     * @return List of certifications for the given user
     */
    List<Certification> getCertificationsByUser(User user);
    
    /**
     * Get certifications by course
     * 
     * @param course The course
     * @return List of certifications for the given course
     */
    List<Certification> getCertificationsByCourse(Course course);
    
    /**
     * Get certifications by status
     * 
     * @param status The status
     * @return List of certifications with the given status
     */
    List<Certification> getCertificationsByStatus(String status);
    
    /**
     * Get certification by user and course
     * 
     * @param user The user
     * @param course The course
     * @return The certification for the given user and course
     */
    Certification getCertificationByUserAndCourse(User user, Course course);
    
    /**
     * Update certification status
     * 
     * @param id The certification ID
     * @param status The new status
     * @return The updated certification
     */
    Certification updateCertificationStatus(Long id, String status);
    
    /**
     * Renew a certification
     * 
     * @param id The certification ID
     * @param newExpiryDate The new expiry date
     * @return The updated certification
     */
    Certification renewCertification(Long id, LocalDateTime newExpiryDate);
    
    /**
     * Revoke a certification
     * 
     * @param id The certification ID
     * @return The updated certification
     */
    Certification revokeCertification(Long id);
    
    /**
     * Verify if a certification is valid
     * 
     * @param certificateCode The certificate code
     * @return True if the certification is valid, false otherwise
     */
    boolean verifyCertification(String certificateCode);
    
    /**
     * Generate a unique certificate code
     * 
     * @return A unique certificate code
     */
    String generateCertificateCode();
    
    /**
     * Delete a certification
     * 
     * @param id The ID of the certification to delete
     */
    void deleteCertification(Long id);
}
