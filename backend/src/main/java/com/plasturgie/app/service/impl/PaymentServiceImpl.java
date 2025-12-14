package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.integration.ClicToPayService;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import com.plasturgie.app.repository.PaymentRepository;
import com.plasturgie.app.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ClicToPayService clicToPayService;

    @Override
    @Transactional
    public Payment initiatePayment(User user, Course course, Event event) {
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setStatus(Status.PENDING);
        payment.setCurrency("TND");
        
        if (course != null) {
            payment.setCourse(course);
            payment.setAmount(course.getPrice());
            
            // Generate token from ClicToPay
            String paymentToken = clicToPayService.initiatePayment(
                    course.getPrice(), 
                    "TND", 
                    "Payment for course: " + course.getTitle());
            
            payment.setClictopayToken(paymentToken);
        } 
        else if (event != null) {
            payment.setEvent(event);
            payment.setAmount(event.getPrice());
            
            // Generate token from ClicToPay
            String paymentToken = clicToPayService.initiatePayment(
                    event.getPrice(), 
                    "TND", 
                    "Payment for event: " + event.getTitle());
            
            payment.setClictopayToken(paymentToken);
        } 
        else {
            throw new IllegalArgumentException("Either course or event must be provided");
        }
        
        // Generate transaction reference (this would be handled by ClicToPay in a real scenario)
        payment.setTransactionReference("PT-" + System.currentTimeMillis());
        
        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }

    @Override
    public Optional<Payment> findByTransactionReference(String transactionReference) {
        return paymentRepository.findByTransactionReference(transactionReference);
    }

    @Override
    public List<Payment> getPaymentsByUser(User user) {
        return paymentRepository.findByUser(user);
    }

    @Override
    public List<Payment> getPaymentsByCourse(Course course) {
        return paymentRepository.findByCourse(course);
    }

    @Override
    public List<Payment> getPaymentsByEvent(Event event) {
        return paymentRepository.findByEvent(event);
    }

    @Override
    public List<Payment> getPaymentsByStatus(Status status) {
        return paymentRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public Payment updatePaymentStatus(Payment payment, Status status) {
        payment.setStatus(status);
        
        if (status == Status.COMPLETED) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public boolean verifyPaymentStatus(String paymentToken) {
        Status paymentStatus = clicToPayService.verifyPayment(paymentToken);
        
        Optional<Payment> paymentOpt = paymentRepository.findAll().stream()
                .filter(p -> p.getClictopayToken() != null && p.getClictopayToken().equals(paymentToken))
                .findFirst();
        
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(paymentStatus);
            
            if (paymentStatus == Status.COMPLETED) {
                payment.setPaymentDate(LocalDateTime.now());
            }
            
            paymentRepository.save(payment);
            return paymentStatus == Status.COMPLETED;
        }
        
        return false;
    }

    @Override
    @Transactional
    public boolean refundPayment(Payment payment) {
        if (payment.getStatus() != Status.COMPLETED) {
            throw new IllegalStateException("Cannot refund a payment that is not completed");
        }
        
        boolean refundSuccessful = clicToPayService.refundPayment(payment);
        
        if (refundSuccessful) {
            payment.setStatus(Status.REFUNDED);
            paymentRepository.save(payment);
        }
        
        return refundSuccessful;
    }
}
