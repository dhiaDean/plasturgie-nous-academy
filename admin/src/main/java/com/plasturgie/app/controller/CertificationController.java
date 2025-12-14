package com.plasturgie.app.controller;

import com.plasturgie.app.model.Certification;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.User;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CertificationService;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    @Autowired
    private CertificationService certificationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Certification> createCertification(
            @RequestParam Long userId,
            @RequestParam Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime issueDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime expiryDate) {
        
        Certification certification = certificationService.createCertification(userId, courseId, issueDate, expiryDate);
        return ResponseEntity.ok(certification);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Certification> getCertificationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Certification certification = certificationService.getCertificationById(id);
        
        // Check if the current user is the certificate owner, an instructor for the course, or an admin
        boolean isAuthorized = certification.getUser().getUserId().equals(currentUser.getId()) ||
                               currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            Course course = certification.getCourse();
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(certification);
    }
    
    
    
    
    @GetMapping("/code/{certificateCode}")
    public ResponseEntity<Certification> getCertificationByCode(@PathVariable String certificateCode) {
        Certification certification = certificationService.getCertificationByCode(certificateCode);
        return ResponseEntity.ok(certification);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId, #currentUser)")
    public ResponseEntity<List<Certification>> getCertificationsByUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findById(userId);
        List<Certification> certifications = certificationService.getCertificationsByUser(user);
        return ResponseEntity.ok(certifications);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Certification>> getCertificationsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Course course = courseService.getCourseById(courseId);
        
        // Check if the current user is an instructor for this course or an admin
        boolean isAuthorized = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        List<Certification> certifications = certificationService.getCertificationsByCourse(course);
        return ResponseEntity.ok(certifications);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Certification>> getCertificationsByStatus(@PathVariable String status) {
        List<Certification> certifications = certificationService.getCertificationsByStatus(status);
        return ResponseEntity.ok(certifications);
    }

    @GetMapping("/my-certifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Certification>> getMyCertifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            // Handle case where user is not authenticated, though @PreAuthorize should prevent this
            return ResponseEntity.status(401).build();
        }
        User user = userService.findById(currentUser.getId());
        if (user == null) {
            // Handle case where user from principal isn't found, though unlikely
            return ResponseEntity.notFound().build();
        }
  
        List<Certification> certifications = certificationService.getCertificationsByUser(user);
        return ResponseEntity.ok(certifications);
        
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Certification> updateCertificationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        Certification certification = certificationService.updateCertificationStatus(id, status);
        return ResponseEntity.ok(certification);
    }

    @PutMapping("/{id}/renew")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Certification> renewCertification(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newExpiryDate,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Certification certification = certificationService.getCertificationById(id);
        
        // Check if the current user is an instructor for the course or an admin
        boolean isAuthorized = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            Course course = certification.getCourse();
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        Certification renewedCertification = certificationService.renewCertification(id, newExpiryDate);
        return ResponseEntity.ok(renewedCertification);
    }

    @PutMapping("/{id}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Certification> revokeCertification(@PathVariable Long id) {
        Certification certification = certificationService.revokeCertification(id);
        return ResponseEntity.ok(certification);
    }

    @GetMapping("/verify/{certificateCode}")
    public ResponseEntity<Map<String, Boolean>> verifyCertification(@PathVariable String certificateCode) {
        boolean isValid = certificationService.verifyCertification(certificateCode);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
    
    @GetMapping("/generate-code")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<String> generateCertificateCode() {
        String code = certificationService.generateCertificateCode(); // Calls the service method
        return ResponseEntity.ok(code);
    }
  

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCertification(@PathVariable Long id) {
        certificationService.deleteCertification(id);
        return ResponseEntity.ok().build();
    }
}
