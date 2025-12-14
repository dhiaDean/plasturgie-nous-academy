package com.plasturgie.app.service;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Event;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for managing events
 */
public interface EventService {
    /**
     * Create a new event
     * 
     * @param event The event to create
     * @param companyId The ID of the company organizing the event
     * @return The created event
     */
    Event createEvent(Event event, Long companyId);
    
    /**
     * Get an event by ID
     * 
     * @param id The event ID
     * @return The event with the given ID
     */
    Event getEventById(Long id);
    
    /**
     * Get all events
     * 
     * @return List of all events
     */
    List<Event> getAllEvents();
    
    /**
     * Get events by company
     * 
     * @param company The company
     * @return List of events organized by the given company
     */
    List<Event> getEventsByCompany(Company company);
    
    /**
     * Get upcoming events
     * 
     * @return List of events scheduled in the future
     */
    List<Event> getUpcomingEvents();
    
    /**
     * Get events with open registration
     * 
     * @return List of events with open registration
     */
    List<Event> getEventsWithOpenRegistration();
    
    /**
     * Search events by title
     * 
     * @param title The event title to search for
     * @return List of events matching the search criteria
     */
    List<Event> searchEventsByTitle(String title);
    
    /**
     * Get events by date range
     * 
     * @param startDate The start date
     * @param endDate The end date
     * @return List of events in the given date range
     */
    List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Update an event
     * 
     * @param id The ID of the event to update
     * @param eventDetails The updated event details
     * @return The updated event
     */
    Event updateEvent(Long id, Event eventDetails);
    
    /**
     * Increment participant count for an event
     * 
     * @param id The event ID
     * @return The updated event
     */
    Event incrementParticipantCount(Long id);
    
    /**
     * Decrement participant count for an event
     * 
     * @param id The event ID
     * @return The updated event
     */
    Event decrementParticipantCount(Long id);
    
    /**
     * Check if an event is full
     * 
     * @param id The event ID
     * @return True if the event is full, false otherwise
     */
    boolean isEventFull(Long id);
    
    /**
     * Delete an event
     * 
     * @param id The ID of the event to delete
     */
    void deleteEvent(Long id);
}
