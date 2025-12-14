package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Certification;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.User;
import com.plasturgie.app.repository.CertificationRepository;
import com.plasturgie.app.service.CertificationService;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CertificationServiceImpl implements CertificationService {

    @Autowired
    private CertificationRepository certificationRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;

    @Override
    @Transactional
    public Certification createCertification(Long userId, Long courseId, LocalDateTime issueDate, LocalDateTime expiryDate) {
        User user = userService.findById(userId);
        Course course = courseService.getCourseById(courseId);
        
        // Check if the course is certification eligible
        if (!course.getCertificationEligible()) {
            throw new IllegalStateException("This course is not eligible for certification");
        }
        
        // Check if user already has a certification for this course
        if (certificationRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new IllegalStateException("User already has a certification for this course");
        }
        
        Certification certification = new Certification();
        certification.setUser(user);
        certification.setCourse(course);
        certification.setCertificateCode(generateCertificateCode());
        certification.setIssueDate(issueDate);
        certification.setExpiryDate(expiryDate);
        certification.setStatus("active");
        
        return certificationRepository.save(certification);
    }

    @Override
    public Certification getCertificationById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));
    }

    @Override
    public Certification getCertificationByCode(String certificateCode) {
        return certificationRepository.findByCertificateCode(certificateCode)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "code", certificateCode));
    }

    @Override
    public List<Certification> getCertificationsByUser(User user) {
        return certificationRepository.findByUser(user);
    }

    @Override
    public List<Certification> getCertificationsByCourse(Course course) {
        return certificationRepository.findByCourse(course);
    }

    @Override
    public List<Certification> getCertificationsByStatus(String status) {
        return certificationRepository.findByStatus(status);
    }

    @Override
    public Certification getCertificationByUserAndCourse(User user, Course course) {
        return certificationRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "user and course", 
                        user.getUserId() + " and " + course.getCourseId()));
    }

    @Override
    @Transactional
    public Certification updateCertificationStatus(Long id, String status) {
        Certification certification = getCertificationById(id);
        
        if (!status.equals("active") && !status.equals("expired") && !status.equals("revoked")) {
            throw new IllegalArgumentException("Invalid status. Must be 'active', 'expired', or 'revoked'");
        }
        
        certification.setStatus(status);
        return certificationRepository.save(certification);
    }

    @Override
    @Transactional
    public Certification renewCertification(Long id, LocalDateTime newExpiryDate) {
        Certification certification = getCertificationById(id);
        
        // Only renew if not revoked
        if (certification.getStatus().equals("revoked")) {
            throw new IllegalStateException("Cannot renew a revoked certification");
        }
        
        certification.setExpiryDate(newExpiryDate);
        certification.setStatus("active");
        
        return certificationRepository.save(certification);
    }

    @Override
    @Transactional
    public Certification revokeCertification(Long id) {
        Certification certification = getCertificationById(id);
        certification.setStatus("revoked");
        
        return certificationRepository.save(certification);
    }
    
    
    
    

    @Override
    public boolean verifyCertification(String certificateCode) {
        try {
            Certification certification = getCertificationByCode(certificateCode);
            
            // Check if certification is active
            if (!certification.getStatus().equals("active")) {
                return false;
            }
            
            // Check if certification has expired
            if (certification.getExpiryDate() != null && 
                    certification.getExpiryDate().isBefore(LocalDateTime.now())) {
                // Automatically update status to expired
                certification.setStatus("expired");
                certificationRepository.save(certification);
                return false;
            }
            
            return true;
            
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }

    @Override
    public String generateCertificateCode() {
        // Generate a UUID-based code
        String code = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Check if the code already exists
        while (certificationRepository.findByCertificateCode(code).isPresent()) {
            code = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        
        return code;
    }

    @Override
    @Transactional
    public void deleteCertification(Long id) {
        Certification certification = getCertificationById(id);
        certificationRepository.delete(certification);
    }
}
