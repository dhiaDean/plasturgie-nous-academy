package com.plasturgie.app.controller;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.EventService;
import com.plasturgie.app.service.PaymentService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private EventService eventService;

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    public ResponseEntity<Payment> initiateCoursePayment(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findById(currentUser.getId());
        Course course = courseService.getCourseById(courseId);
        
        Payment payment = paymentService.initiatePayment(user, course, null);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/event/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Payment> initiateEventPayment(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findById(currentUser.getId());
        Event event = eventService.getEventById(eventId);
        
        Payment payment = paymentService.initiatePayment(user, null, event);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Payment>> getUserPayments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findById(currentUser.getId());
        List<Payment> payments = paymentService.getPaymentsByUser(user);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Payment payment = paymentService.getPaymentById(id);
        
        // Check if the payment belongs to the current user or user is admin
        if (!payment.getUser().getUserId().equals(currentUser.getId()) && 
                !currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/verify/{token}")
    public ResponseEntity<Map<String, Boolean>> verifyPayment(@PathVariable String token) {
        boolean verified = paymentService.verifyPaymentStatus(token);
        return ResponseEntity.ok(Map.of("success", verified));
    }
    
    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> refundPayment(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        boolean refunded = paymentService.refundPayment(payment);
        return ResponseEntity.ok(Map.of("success", refunded));
    }
    
    @GetMapping("/callback")
    public ResponseEntity<String> handlePaymentCallback(
            @RequestParam String token,
            @RequestParam String status) {
        
        boolean verified = paymentService.verifyPaymentStatus(token);
        
        if (verified) {
            return ResponseEntity.ok("Payment successfully completed");
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }
    }
}
