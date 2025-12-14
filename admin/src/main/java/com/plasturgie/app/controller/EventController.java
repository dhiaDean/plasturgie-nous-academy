package com.plasturgie.app.controller;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.User;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.EventService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(
            @Valid @RequestBody Event event,
            @RequestParam Long companyId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Company company = companyService.getCompanyById(companyId);
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Event newEvent = eventService.createEvent(event, companyId);
        return ResponseEntity.ok(newEvent);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/by-company/{companyId}")
    public ResponseEntity<List<Event>> getEventsByCompany(@PathVariable Long companyId) {
        Company company = companyService.getCompanyById(companyId);
        List<Event> events = eventService.getEventsByCompany(company);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/open-registration")
    public ResponseEntity<List<Event>> getEventsWithOpenRegistration() {
        List<Event> events = eventService.getEventsWithOpenRegistration();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String title) {
        List<Event> events = eventService.searchEventsByTitle(title);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Event> events = eventService.getEventsByDateRange(startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody Event eventDetails,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Event existingEvent = eventService.getEventById(id);
        Company company = existingEvent.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/{id}/increment-participants")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Event> incrementParticipantCount(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Event event = eventService.getEventById(id);
        Company company = event.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Event updatedEvent = eventService.incrementParticipantCount(id);
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/{id}/decrement-participants")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Event> decrementParticipantCount(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Event event = eventService.getEventById(id);
        Company company = event.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Event updatedEvent = eventService.decrementParticipantCount(id);
        return ResponseEntity.ok(updatedEvent);
    }

    @GetMapping("/{id}/is-full")
    public ResponseEntity<Map<String, Boolean>> checkIfEventIsFull(@PathVariable Long id) {
        boolean isFull = eventService.isEventFull(id);
        return ResponseEntity.ok(Map.of("isFull", isFull));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Event event = eventService.getEventById(id);
        Company company = event.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }
}
