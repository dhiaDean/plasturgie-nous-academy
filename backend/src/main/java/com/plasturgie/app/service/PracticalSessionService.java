package com.plasturgie.app.service;
import java.util.List;

import com.plasturgie.app.dto.PracticalSessionDTO;
import com.plasturgie.app.dto.PracticalSessionInputDTO;
import com.plasturgie.app.security.UserPrincipal;

public interface PracticalSessionService {
    PracticalSessionDTO createPracticalSession(PracticalSessionInputDTO sessionInputDTO, UserPrincipal currentUser);
    PracticalSessionDTO getPracticalSessionById(Long sessionId);
    List<PracticalSessionDTO> getPracticalSessionsByCourseId(Long courseId);
    List<PracticalSessionDTO> getUpcomingPracticalSessionsForUser(UserPrincipal currentUser); // For "Consultation"
    List<PracticalSessionDTO> getPracticalSessionsForInstructorDashboard(UserPrincipal currentUser); // For "Dashboard"
    PracticalSessionDTO updatePracticalSession(Long sessionId, PracticalSessionInputDTO sessionInputDTO, UserPrincipal currentUser);
    void deletePracticalSession(Long sessionId, UserPrincipal currentUser);
    // Potentially methods to change session status, etc.
}
