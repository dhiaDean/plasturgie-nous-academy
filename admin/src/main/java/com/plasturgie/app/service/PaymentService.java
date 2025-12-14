package com.plasturgie.app.service;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;

import java.util.List;
import java.util.Optional;

public interface PaymentService {
    Payment initiatePayment(User user, Course course, Event event);
    
    Payment getPaymentById(Long id);
    
    Optional<Payment> findByTransactionReference(String transactionReference);
    
    List<Payment> getPaymentsByUser(User user);
    
    List<Payment> getPaymentsByCourse(Course course);
    
    List<Payment> getPaymentsByEvent(Event event);
    
    List<Payment> getPaymentsByStatus(Status status);
    
    Payment updatePaymentStatus(Payment payment, Status status);
    
    boolean verifyPaymentStatus(String paymentToken);
    
    boolean refundPayment(Payment payment);
}
