package com.plasturgie.app.controller;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plasturgie.app.dto.PracticalSessionDTO;
import com.plasturgie.app.dto.PracticalSessionInputDTO;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.PracticalSessionService;

@RestController
@RequestMapping("/api/practical-sessions")
public class PracticalSessionController {

    @Autowired
    private PracticalSessionService practicalSessionService;

    private static final Logger logger = LoggerFactory.getLogger(PracticalSessionController.class);

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<PracticalSessionDTO> createPracticalSession(
            @Valid @RequestBody PracticalSessionInputDTO sessionInputDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("Request to create practical session by user: {}", currentUser.getUsername());
        PracticalSessionDTO createdSession = practicalSessionService.createPracticalSession(sessionInputDTO, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
    }

    @GetMapping("/{sessionId}")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<PracticalSessionDTO> getPracticalSessionById(@PathVariable Long sessionId) {
        PracticalSessionDTO session = practicalSessionService.getPracticalSessionById(sessionId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PracticalSessionDTO>> getPracticalSessionsByCourse(@PathVariable Long courseId) {
        List<PracticalSessionDTO> sessions = practicalSessionService.getPracticalSessionsByCourseId(courseId);
        return ResponseEntity.ok(sessions);
    }

    // Endpoint for "Fenêtre Consultation Session Pratique (Web)"
    @GetMapping("/user/me/upcoming")
    @PreAuthorize("isAuthenticated()") // Specifically for any authenticated user (learner, instructor, etc.)
    public ResponseEntity<List<PracticalSessionDTO>> getMyUpcomingPracticalSessions(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("User {} requesting their upcoming practical sessions.", currentUser.getUsername());
        List<PracticalSessionDTO> sessions = practicalSessionService.getUpcomingPracticalSessionsForUser(currentUser);
        return ResponseEntity.ok(sessions);
    }

    // Endpoint for "Fenêtre Dashboard Session Pratique" (for instructors)
    @GetMapping("/instructor/dashboard")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<PracticalSessionDTO>> getInstructorPracticalSessionDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("Instructor {} requesting their practical session dashboard.", currentUser.getUsername());
        List<PracticalSessionDTO> sessions = practicalSessionService.getPracticalSessionsForInstructorDashboard(currentUser);
        return ResponseEntity.ok(sessions);
    }

    @PutMapping("/{sessionId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<PracticalSessionDTO> updatePracticalSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody PracticalSessionInputDTO sessionInputDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("Request to update practical session ID: {} by user: {}", sessionId, currentUser.getUsername());
        PracticalSessionDTO updatedSession = practicalSessionService.updatePracticalSession(sessionId, sessionInputDTO, currentUser);
        return ResponseEntity.ok(updatedSession);
    }

    @DeleteMapping("/{sessionId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deletePracticalSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("Request to delete practical session ID: {} by user: {}", sessionId, currentUser.getUsername());
        practicalSessionService.deletePracticalSession(sessionId, currentUser);
        return ResponseEntity.noContent().build();
    }
}