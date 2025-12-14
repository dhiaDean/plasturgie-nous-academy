package com.plasturgie.app.controller;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Enrollment;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.EnrollmentService;
import com.plasturgie.app.service.PaymentService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> createEnrollment(
            @RequestParam Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Enrollment enrollment = enrollmentService.createEnrollment(currentUser.getId(), courseId);
        return ResponseEntity.ok(enrollment);
    }

    @PostMapping("/with-payment")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> createEnrollmentWithPayment(
            @RequestParam Long courseId,
            @RequestParam Long paymentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify that the payment belongs to the current user
        Payment payment = paymentService.getPaymentById(paymentId);
        if (!payment.getUser().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Enrollment enrollment = enrollmentService.createEnrollmentWithPayment(
                currentUser.getId(), courseId, paymentId);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Enrollment> getEnrollmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        
        // Check if the current user is the enrolled user, an instructor for the course, or an admin
        boolean isAuthorized = enrollment.getUser().getUserId().equals(currentUser.getId()) ||
                               currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            Course course = enrollment.getCourse();
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findById(currentUser.getId());
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUser(user);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(
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
        
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourse(course);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStatus(@PathVariable Status status) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStatus(status);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/user/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByUserAndStatus(
            @PathVariable Status status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findById(currentUser.getId());
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUserAndStatus(user, status);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestParam Status status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        
        // Check if the current user is an instructor for this course or an admin
        boolean isAuthorized = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            Course course = enrollment.getCourse();
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        Enrollment updatedEnrollment = enrollmentService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> completeEnrollment(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime completionDate,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        
        // Check if the current user is an instructor for this course or an admin
        boolean isAuthorized = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAuthorized && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
            Course course = enrollment.getCourse();
            isAuthorized = course.getInstructors().stream()
                    .anyMatch(i -> i.getUser().getUserId().equals(currentUser.getId()));
        }
        
        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }
        
        // Use current time if no completion date is provided
        if (completionDate == null) {
            completionDate = LocalDateTime.now();
        }
        
        Enrollment updatedEnrollment = enrollmentService.completeEnrollment(id, completionDate);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @PutMapping("/{id}/payment/{paymentId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> addPaymentToEnrollment(
            @PathVariable Long id,
            @PathVariable Long paymentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        
        // Check if the current user is the enrolled user or an admin
        if (!enrollment.getUser().getUserId().equals(currentUser.getId()) &&
                currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        Payment payment = paymentService.getPaymentById(paymentId);
        Enrollment updatedEnrollment = enrollmentService.addPaymentToEnrollment(id, payment);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.ok().build();
    }
}