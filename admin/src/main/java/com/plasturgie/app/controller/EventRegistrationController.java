package com.plasturgie.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.plasturgie.app.model.Event;
import com.plasturgie.app.model.EventRegistration;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Status;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.EventRegistrationService;
import com.plasturgie.app.service.EventService;
import com.plasturgie.app.service.UserService;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event-registrations")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService eventRegistrationService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('LEARNER', 'COMPANY_REP', 'ADMIN')")
    public ResponseEntity<EventRegistration> createRegistration(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody Map<String, Long> payload) {
        
        Long eventId = payload.get("eventId");
        Event event = eventService.getEventById(eventId);
        User user = userService.findById(currentUser.getId());
        
        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(Status.PENDING);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setAttended(false);
        
        return ResponseEntity.ok(eventRegistrationService.createRegistration(registration));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventRegistration>> getAllRegistrations() {
        return ResponseEntity.ok(eventRegistrationService.getAllRegistrations());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LEARNER', 'COMPANY_REP', 'ADMIN')")
    public ResponseEntity<EventRegistration> getRegistrationById(@PathVariable Long id) {
        return ResponseEntity.ok(eventRegistrationService.getRegistrationById(id));
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByUser(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(eventRegistrationService.getRegistrationsByUser(user));
    }
    
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('COMPANY_REP', 'ADMIN')")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByEvent(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId);
        return ResponseEntity.ok(eventRegistrationService.getRegistrationsByEvent(event));
    }
    
    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('COMPANY_REP', 'ADMIN')")
    public ResponseEntity<Void> markAttendance(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        
        Boolean attended = payload.get("attended");
        eventRegistrationService.markAttendance(id, attended);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LEARNER', 'ADMIN')")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long id) {
        eventRegistrationService.cancelRegistration(id);
        return ResponseEntity.ok().build();
    }
}