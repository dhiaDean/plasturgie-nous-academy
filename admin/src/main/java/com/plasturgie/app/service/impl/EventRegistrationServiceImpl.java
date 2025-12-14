package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.EventRegistration;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import com.plasturgie.app.repository.EventRegistrationRepository;
import com.plasturgie.app.service.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Override
    @Transactional
    public EventRegistration createRegistration(EventRegistration registration) {
        if (registration.getRegistrationDate() == null) {
            registration.setRegistrationDate(LocalDateTime.now());
        }
        
        if (registration.getStatus() == null) {
            registration.setStatus(Status.PENDING);
        }
        
        return eventRegistrationRepository.save(registration);
    }

    @Override
    public EventRegistration getRegistrationById(Long id) {
        return eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventRegistration", "id", id));
    }

    @Override
    public List<EventRegistration> getAllRegistrations() {
        return eventRegistrationRepository.findAll();
    }

    @Override
    public List<EventRegistration> getRegistrationsByUser(User user) {
        return eventRegistrationRepository.findByUser(user);
    }

    @Override
    public List<EventRegistration> getRegistrationsByEvent(Event event) {
        return eventRegistrationRepository.findByEvent(event);
    }

    @Override
    public List<EventRegistration> getRegistrationsByStatus(Status status) {
        return eventRegistrationRepository.findByStatus(status);
    }

    @Override
    public EventRegistration getUserEventRegistration(User user, Event event) {
        return eventRegistrationRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException("EventRegistration", "user and event", user.getUserId() + ", " + event.getEventId()));
    }

    @Override
    public List<EventRegistration> getUserRegistrationsByStatus(User user, Status status) {
        return eventRegistrationRepository.findByUserAndStatus(user, status);
    }

    @Override
    public List<EventRegistration> getEventRegistrationsByStatus(Event event, Status status) {
        return eventRegistrationRepository.findByEventAndStatus(event, status);
    }

    @Override
    @Transactional
    public EventRegistration updateRegistration(Long id, EventRegistration updatedRegistration) {
        EventRegistration registration = getRegistrationById(id);
        
        registration.setStatus(updatedRegistration.getStatus());
        registration.setAttended(updatedRegistration.getAttended());
        
        return eventRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void markAttendance(Long id, Boolean attended) {
        EventRegistration registration = getRegistrationById(id);
        registration.setAttended(attended);
        eventRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void cancelRegistration(Long id) {
        EventRegistration registration = getRegistrationById(id);
        registration.setStatus(Status.DROPPED); // Using DROPPED as CANCELLED
        eventRegistrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void deleteRegistration(Long id) {
        EventRegistration registration = getRegistrationById(id);
        eventRegistrationRepository.delete(registration);
    }
}