package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Enrollment;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import com.plasturgie.app.repository.EnrollmentRepository;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.EnrollmentService;
import com.plasturgie.app.service.PaymentService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private PaymentService paymentService;

    @Override
    @Transactional
    public Enrollment createEnrollment(Long userId, Long courseId) {
        User user = userService.findById(userId);
        Course course = courseService.getCourseById(courseId);
        
        // Check if enrollment already exists
        if (enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new IllegalStateException("User is already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setStatus(Status.PENDING);
        
        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public Enrollment createEnrollmentWithPayment(Long userId, Long courseId, Long paymentId) {
        User user = userService.findById(userId);
        Course course = courseService.getCourseById(courseId);
        Payment payment = paymentService.getPaymentById(paymentId);
        
        // Check if enrollment already exists
        if (enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new IllegalStateException("User is already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setPayment(payment);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setStatus(Status.ACTIVE); // Assuming payment is complete
        
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));
    }

    @Override
    public Enrollment getEnrollmentByUserAndCourse(User user, Course course) {
        return enrollmentRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "user and course", 
                        user.getUserId() + " and " + course.getCourseId()));
    }

    @Override
    public List<Enrollment> getEnrollmentsByUser(User user) {
        return enrollmentRepository.findByUser(user);
    }

    @Override
    public List<Enrollment> getEnrollmentsByCourse(Course course) {
        return enrollmentRepository.findByCourse(course);
    }

    @Override
    public List<Enrollment> getEnrollmentsByStatus(Status status) {
        return enrollmentRepository.findByStatus(status);
    }

    @Override
    public List<Enrollment> getEnrollmentsByUserAndStatus(User user, Status status) {
        return enrollmentRepository.findByUserAndStatus(user, status);
    }

    @Override
    @Transactional
    public Enrollment updateEnrollmentStatus(Long id, Status status) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setStatus(status);
        
        if (status == Status.COMPLETED) {
            enrollment.setCompletionDate(LocalDateTime.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public Enrollment completeEnrollment(Long id, LocalDateTime completionDate) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setStatus(Status.COMPLETED);
        enrollment.setCompletionDate(completionDate);
        
        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public Enrollment addPaymentToEnrollment(Long enrollmentId, Payment payment) {
        Enrollment enrollment = getEnrollmentById(enrollmentId);
        enrollment.setPayment(payment);
        
        // If payment is completed, update status to ACTIVE
        if (payment.getStatus() == Status.COMPLETED) {
            enrollment.setStatus(Status.ACTIVE);
        }
        
        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollmentRepository.delete(enrollment);
    }
}
