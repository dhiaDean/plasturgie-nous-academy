package com.plasturgie.app.service;

import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.EventRegistration;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;

import java.util.List;

/**
 * Service interface for managing event registrations
 */
public interface EventRegistrationService {
    EventRegistration createRegistration(EventRegistration registration);
    
    EventRegistration getRegistrationById(Long id);
    
    List<EventRegistration> getAllRegistrations();
    
    List<EventRegistration> getRegistrationsByUser(User user);
    
    List<EventRegistration> getRegistrationsByEvent(Event event);
    
    List<EventRegistration> getRegistrationsByStatus(Status status);
    
    EventRegistration getUserEventRegistration(User user, Event event);
    
    List<EventRegistration> getUserRegistrationsByStatus(User user, Status status);
    
    List<EventRegistration> getEventRegistrationsByStatus(Event event, Status status);
    
    EventRegistration updateRegistration(Long id, EventRegistration registration);
    
    void markAttendance(Long id, Boolean attended);
    
    void cancelRegistration(Long id);
    
    void deleteRegistration(Long id);
}