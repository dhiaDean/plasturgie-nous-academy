package com.plasturgie.app.service.impl;

import com.plasturgie.app.dto.PracticalSessionDTO;
import com.plasturgie.app.dto.PracticalSessionInputDTO;
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Enrollment;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.PracticalSession;
// import com.plasturgie.app.model.User; // Not strictly needed if UserPrincipal provides all info
import com.plasturgie.app.model.enums.PracticalSessionStatus;
import com.plasturgie.app.model.enums.Role;
import com.plasturgie.app.repository.CourseRepository;
import com.plasturgie.app.repository.EnrollmentRepository;
import com.plasturgie.app.repository.InstructorRepository;
import com.plasturgie.app.repository.PracticalSessionRepository;
// import com.plasturgie.app.repository.UserRepository; // Keep if you need to fetch full User for other reasons
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.PracticalSessionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PracticalSessionServiceImpl implements PracticalSessionService {

    private static final Logger logger = LoggerFactory.getLogger(PracticalSessionServiceImpl.class);

    private final PracticalSessionRepository practicalSessionRepository;
    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final EnrollmentRepository enrollmentRepository;
    // private final UserRepository userRepository; // Uncomment if needed

    // Formatter for DTO output - matches your UI image format
    private static final DateTimeFormatter DTO_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a");


    @Autowired
    public PracticalSessionServiceImpl(PracticalSessionRepository practicalSessionRepository,
                                       CourseRepository courseRepository,
                                       InstructorRepository instructorRepository,
                                       EnrollmentRepository enrollmentRepository
                                       /*, UserRepository userRepository */) { // Uncomment if userRepository is used
        this.practicalSessionRepository = practicalSessionRepository;
        this.courseRepository = courseRepository;
        this.instructorRepository = instructorRepository;
        this.enrollmentRepository = enrollmentRepository;
        // this.userRepository = userRepository; // Uncomment if needed
    }

    @Override
    @Transactional
    public PracticalSessionDTO createPracticalSession(PracticalSessionInputDTO sessionInputDTO, UserPrincipal currentUser) {
        logger.info("SERVICE - Creating practical session titled '{}' by user {}", sessionInputDTO.getTitle(), currentUser.getUsername());

        Course course = courseRepository.findById(sessionInputDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", sessionInputDTO.getCourseId()));

        Instructor conductingInstructor = instructorRepository.findById(sessionInputDTO.getConductingInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", sessionInputDTO.getConductingInstructorId()));

        
        authorizeInstructorAction(currentUser, course, "create practical session for");

        PracticalSession practicalSession = new PracticalSession();
        practicalSession.setTitle(sessionInputDTO.getTitle());
        practicalSession.setDescription(sessionInputDTO.getDescription());
        practicalSession.setSessionDateTime(sessionInputDTO.getSessionDateTime());
        practicalSession.setLocation(sessionInputDTO.getLocation());
        practicalSession.setDurationMinutes(sessionInputDTO.getDurationMinutes());
        practicalSession.setCourse(course);
        practicalSession.setConductingInstructor(conductingInstructor);
        practicalSession.setStatus(sessionInputDTO.getStatus() != null ? sessionInputDTO.getStatus() : PracticalSessionStatus.UPCOMING);

        PracticalSession savedSession = practicalSessionRepository.save(practicalSession);
        logger.info("SERVICE - Practical session ID: {} created successfully.", savedSession.getId());
        return mapToDTO(savedSession);
    }

    @Override
    @Transactional(readOnly = true)
    public PracticalSessionDTO getPracticalSessionById(Long sessionId) {
        logger.debug("SERVICE - Fetching practical session by ID: {}", sessionId);
        PracticalSession session = practicalSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PracticalSession", "id", sessionId));
        // Future: Add authorization if needed: e.g., user must be enrolled in the course of this session
        // or be an admin/instructor for the course.
        return mapToDTO(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticalSessionDTO> getPracticalSessionsByCourseId(Long courseId) {
        logger.debug("SERVICE - Fetching practical sessions for course ID: {}", courseId);
        if (!courseRepository.existsById(courseId)) {
            logger.warn("SERVICE - Course not found with ID: {} when fetching practical sessions.", courseId);
            throw new ResourceNotFoundException("Course", "id", courseId);
        }
        List<PracticalSession> sessions = practicalSessionRepository.findByCourseCourseIdOrderBySessionDateTimeAsc(courseId);
        return sessions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticalSessionDTO> getUpcomingPracticalSessionsForUser(UserPrincipal currentUser) {
        logger.info("SERVICE - Fetching upcoming practical sessions for user: {}", currentUser.getUsername());
        Long userId = currentUser.getId();
        // Assumes EnrollmentRepository has findByUserUserId(Long userId)
        List<Enrollment> enrollments = enrollmentRepository.findByUserUserId(userId);

        if (enrollments.isEmpty()) {
            logger.info("SERVICE - User {} (ID: {}) has no course enrollments.", currentUser.getUsername(), userId);
            return List.of();
        }

        List<Long> courseIds = enrollments.stream()
                                          .map(enrollment -> enrollment.getCourse().getCourseId())
                                          .distinct()
                                          .collect(Collectors.toList());

        List<PracticalSession> sessions = practicalSessionRepository.findByCourseCourseIdInAndStatusOrderBySessionDateTimeAsc(courseIds, PracticalSessionStatus.UPCOMING);
        logger.info("SERVICE - Found {} upcoming practical sessions for user {} across {} courses.", sessions.size(), currentUser.getUsername(), courseIds.size());
        return sessions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticalSessionDTO> getPracticalSessionsForInstructorDashboard(UserPrincipal currentUser) {
        logger.info("SERVICE - Fetching practical session dashboard for instructor: {}", currentUser.getUsername());
        // Using instructorRepository.findByUserId as requested
        Instructor instructor = instructorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor profile not found for user ID: " + currentUser.getId()));

        // This shows sessions this instructor is *directly set as the conducting instructor for*.
        // If dashboard should show all sessions for *any course they are an instructor of*, logic would be different:
        // 1. Get all courses the instructor is associated with (instructor.getCourses())
        // 2. Get all practical sessions for those course IDs.
        List<PracticalSession> sessions = practicalSessionRepository.findByConductingInstructorInstructorIdOrderBySessionDateTimeAsc(instructor.getInstructorId());
        logger.info("SERVICE - Found {} practical sessions for instructor dashboard (ID: {}) where they are conducting.", sessions.size(), instructor.getInstructorId());
        return sessions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PracticalSessionDTO updatePracticalSession(Long sessionId, PracticalSessionInputDTO sessionInputDTO, UserPrincipal currentUser) {
        logger.info("SERVICE - Updating practical session ID: {} by user {}", sessionId, currentUser.getUsername());

        PracticalSession practicalSession = practicalSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PracticalSession", "id", sessionId));

        Course originalCourse = practicalSession.getCourse();
        authorizeInstructorAction(currentUser, originalCourse, "update practical session for");

        practicalSession.setTitle(sessionInputDTO.getTitle());
        practicalSession.setDescription(sessionInputDTO.getDescription());
        practicalSession.setSessionDateTime(sessionInputDTO.getSessionDateTime());
        practicalSession.setLocation(sessionInputDTO.getLocation());
        practicalSession.setDurationMinutes(sessionInputDTO.getDurationMinutes());
        if (sessionInputDTO.getStatus() != null) {
            practicalSession.setStatus(sessionInputDTO.getStatus());
        }

        // Handle potential change in course or instructor
        if (!practicalSession.getCourse().getCourseId().equals(sessionInputDTO.getCourseId())) {
            logger.debug("SERVICE - Course ID change detected for session {}. Old: {}, New: {}", sessionId, practicalSession.getCourse().getCourseId(), sessionInputDTO.getCourseId());
            Course newCourse = courseRepository.findById(sessionInputDTO.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("New Course for update", "id", sessionInputDTO.getCourseId()));
            authorizeInstructorAction(currentUser, newCourse, "move practical session to"); // Re-authorize for the new course
            practicalSession.setCourse(newCourse);
        }
        if (!practicalSession.getConductingInstructor().getInstructorId().equals(sessionInputDTO.getConductingInstructorId())) {
            logger.debug("SERVICE - Conducting instructor ID change detected for session {}. Old: {}, New: {}", sessionId, practicalSession.getConductingInstructor().getInstructorId(), sessionInputDTO.getConductingInstructorId());
            Instructor newConductingInstructor = instructorRepository.findById(sessionInputDTO.getConductingInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("New Conducting Instructor for update", "id", sessionInputDTO.getConductingInstructorId()));
            practicalSession.setConductingInstructor(newConductingInstructor);
        }

        PracticalSession updatedSession = practicalSessionRepository.save(practicalSession);
        logger.info("SERVICE - Practical session ID: {} updated successfully.", updatedSession.getId());
        return mapToDTO(updatedSession);
    }

    @Override
    @Transactional
    public void deletePracticalSession(Long sessionId, UserPrincipal currentUser) {
        logger.info("SERVICE - Deleting practical session ID: {} by user {}", sessionId, currentUser.getUsername());
        PracticalSession practicalSession = practicalSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("PracticalSession", "id", sessionId));

        authorizeInstructorAction(currentUser, practicalSession.getCourse(), "delete practical session from");

        practicalSessionRepository.delete(practicalSession);
        logger.info("SERVICE - Practical session ID: {} deleted successfully.", sessionId);
    }

    // --- Helper & Mapper Methods ---

    private void authorizeInstructorAction(UserPrincipal currentUser, Course course, String actionDescription) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + Role.ADMIN.name()));

        if (isAdmin) {
            logger.debug("SERVICE - Admin {} authorized for action: '{}' on course ID: {}", currentUser.getUsername(), actionDescription, course.getCourseId());
            return; // Admin can do anything
        }

        // Check if the current user is an instructor for the given course
        boolean isInstructorForCourse = course.getInstructors().stream()
                .anyMatch(instructor -> instructor.getUser() != null && instructor.getUser().getUserId().equals(currentUser.getId()));

        if (!isInstructorForCourse) {
            logger.warn("SERVICE - User {} (ID: {}) is NOT an authorized instructor for course ID: {} to {}.",
                         currentUser.getUsername(), currentUser.getId(), course.getCourseId(), actionDescription);
            throw new AccessDeniedException("User not authorized to " + actionDescription + " course: " + course.getTitle());
        }
        logger.debug("SERVICE - Instructor {} authorized for action: '{}' on course ID: {}", currentUser.getUsername(), actionDescription, course.getCourseId());
    }


    private PracticalSessionDTO mapToDTO(PracticalSession session) {
        if (session == null) {
            return null;
        }
        PracticalSessionDTO dto = new PracticalSessionDTO();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDescription(session.getDescription());
        dto.setSessionDateTime(session.getSessionDateTime());
        if (session.getSessionDateTime() != null) {
            dto.setSessionDateTimeFormatted(session.getSessionDateTime().format(DTO_DATE_TIME_FORMATTER));
        }
        dto.setLocation(session.getLocation());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setStatus(session.getStatus());

        if (session.getCourse() != null) {
            dto.setCourseId(session.getCourse().getCourseId());
            dto.setCourseTitle(session.getCourse().getTitle());
            // Mapping course subtitle from course description (as per UI example)
            // You might have a dedicated field in Course for this (e.g., course.getSubtitle())
            String courseDesc = session.getCourse().getDescription();
            if (courseDesc != null) {
                 // Example: use first line or first 70 characters for a subtitle
                String[] lines = courseDesc.split("\\r?\\n");
                String subTitle = lines[0].length() > 70 ? lines[0].substring(0, 70) + "..." : lines[0];
                dto.setCourseSubTitle(subTitle);
            } else {
                dto.setCourseSubTitle(""); // Or null
            }
        }

        if (session.getConductingInstructor() != null) {
            Instructor instructor = session.getConductingInstructor();
            dto.setConductingInstructorId(instructor.getInstructorId());
            if (instructor.getUser() != null) {
                // Concatenate first and last name for display
                String firstName = instructor.getUser().getFirstName() != null ? instructor.getUser().getFirstName() : "";
                String lastName = instructor.getUser().getLastName() != null ? instructor.getUser().getLastName() : "";
                dto.setConductingInstructorName((firstName + " " + lastName).trim());
                // dto.setConductingInstructorAvatarUrl(...); // If you have avatar URLs
            } else {
                 dto.setConductingInstructorName("Instructor (No User Details)");
                 logger.warn("PracticalSession ID: {} has conducting instructor ID: {} but user details are missing.", session.getId(), instructor.getInstructorId());
            }
        }
        return dto;
    }
}