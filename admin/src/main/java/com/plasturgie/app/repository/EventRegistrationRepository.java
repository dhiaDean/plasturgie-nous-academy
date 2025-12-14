package com.plasturgie.app.repository;

import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.EventRegistration;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUser(User user);
    
    List<EventRegistration> findByEvent(Event event);
    
    List<EventRegistration> findByStatus(Status status);
    
    Optional<EventRegistration> findByUserAndEvent(User user, Event event);
    
    List<EventRegistration> findByUserAndStatus(User user, Status status);
    
    List<EventRegistration> findByEventAndStatus(Event event, Status status);
}