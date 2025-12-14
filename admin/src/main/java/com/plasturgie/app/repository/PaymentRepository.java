package com.plasturgie.app.repository;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    
    List<Payment> findByCourse(Course course);
    
    List<Payment> findByEvent(Event event);
    
    List<Payment> findByStatus(Status status);
    
    Optional<Payment> findByTransactionReference(String transactionReference);
    
    List<Payment> findByUserAndStatus(User user, Status status);
}
