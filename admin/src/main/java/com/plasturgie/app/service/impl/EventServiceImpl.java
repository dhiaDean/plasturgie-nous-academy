package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.repository.EventRepository;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private CompanyService companyService;

    @Override
    @Transactional
    public Event createEvent(Event event, Long companyId) {
        Company company = companyService.getCompanyById(companyId);
        event.setCompany(company);
        
        // Initialize participant count if not set
        if (event.getCurrentParticipants() == null) {
            event.setCurrentParticipants(0);
        }
        
        return eventRepository.save(event);
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getEventsByCompany(Company company) {
        return eventRepository.findByCompany(company);
    }

    @Override
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now());
    }

    @Override
    public List<Event> getEventsWithOpenRegistration() {
        return eventRepository.findByRegistrationDeadlineAfter(LocalDateTime.now());
    }

    @Override
    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByEventDateBetween(startDate, endDate);
    }

    @Override
    @Transactional
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        
        // Basic manual copy with proper getters and setters
        if (eventDetails.getTitle() != null) {
            event.setTitle(eventDetails.getTitle());
        }
        if (eventDetails.getDescription() != null) {
            event.setDescription(eventDetails.getDescription());
        }
        if (eventDetails.getLocation() != null) {
            event.setLocation(eventDetails.getLocation());
        }
        if (eventDetails.getEventDate() != null) {
            event.setEventDate(eventDetails.getEventDate());
        }
        if (eventDetails.getRegistrationDeadline() != null) {
            event.setRegistrationDeadline(eventDetails.getRegistrationDeadline());
        }
        if (eventDetails.getPrice() != null) {
            event.setPrice(eventDetails.getPrice());
        }
        if (eventDetails.getMaxParticipants() != null) {
            event.setMaxParticipants(eventDetails.getMaxParticipants());
        }
        
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event incrementParticipantCount(Long id) {
        Event event = getEventById(id);
        
        // Check if event is full
        if (isEventFull(id)) {
            throw new IllegalStateException("Event is already full");
        }
        
        Integer currentCount = event.getCurrentParticipants();
        if (currentCount == null) {
            currentCount = 0;
        }
        event.setCurrentParticipants(currentCount + 1);
        
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event decrementParticipantCount(Long id) {
        Event event = getEventById(id);
        
        Integer currentCount = event.getCurrentParticipants();
        if (currentCount == null) {
            currentCount = 0;
        } else if (currentCount > 0) {
            event.setCurrentParticipants(currentCount - 1);
        }
        
        return eventRepository.save(event);
    }

    @Override
    public boolean isEventFull(Long id) {
        Event event = getEventById(id);
        
        return event.getMaxParticipants() != null && 
               event.getCurrentParticipants() != null &&
               event.getCurrentParticipants() >= event.getMaxParticipants();
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
