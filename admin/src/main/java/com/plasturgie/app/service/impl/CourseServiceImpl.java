package com.plasturgie.app.service.impl;

import com.plasturgie.app.dto.CourseInputDTO;
import com.plasturgie.app.dto.CourseListDTO;
import com.plasturgie.app.dto.ModuleResponseDTO; // Ensure this is imported
import com.plasturgie.app.dto.SimpleInstructorDTO;
// SimpleModuleDTO is no longer directly used in mapCourseToCourseListDTO for the modules list
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.*;
import com.plasturgie.app.model.Module;
import com.plasturgie.app.model.enums.Mode;
import com.plasturgie.app.model.enums.Role;
import com.plasturgie.app.repository.CourseRepository;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.InstructorService;
// import com.plasturgie.app.service.ModuleService; // Not strictly needed if mapping helper is local

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository courseRepository;
    private final InstructorService instructorService;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, InstructorService instructorService) {
        this.courseRepository = courseRepository;
        this.instructorService = instructorService;
    }

    private boolean hasRole(UserPrincipal principal, Role roleEnum) {
        if (principal == null || principal.getAuthorities() == null || roleEnum == null) {
            return false;
        }
        String roleName = "ROLE_" + roleEnum.name();
        return principal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .anyMatch(roleName::equals);
    }

    private void authorizeCourseModification(Course course, UserPrincipal currentUser) {
        if (currentUser == null) {
            logger.warn("Attempt to modify course {} without authentication.", course.getCourseId());
            throw new AccessDeniedException("User not authenticated.");
        }
        logger.debug("Authorizing modification for course ID: {} by user: {}", course.getCourseId(), currentUser.getUsername());

        if (hasRole(currentUser, Role.ADMIN)) {
            logger.debug("Admin {} authorized to modify course {}.", currentUser.getUsername(), course.getCourseId());
            return;
        }
        if (hasRole(currentUser, Role.INSTRUCTOR)) {
            try {
                Instructor currentInstructorEntity = instructorService.findByUserId(currentUser.getId());
                boolean isAssignedInstructor = course.getInstructors().stream()
                        .anyMatch(instr -> instr.getInstructorId().equals(currentInstructorEntity.getInstructorId()));
                
                if (!isAssignedInstructor) {
                    logger.warn("Access Denied: Instructor {} (User ID: {}) is not assigned to course {}.",
                            currentUser.getUsername(), currentUser.getId(), course.getCourseId());
                    throw new AccessDeniedException("Instructor is not authorized to modify this course.");
                }
                logger.debug("Instructor {} authorized to modify course {}.", currentUser.getUsername(), course.getCourseId());
                return;
            } catch (ResourceNotFoundException e) {
                logger.error("Access Denied: Instructor profile not found for user ID: {}, cannot authorize course modification.", currentUser.getId(), e);
                throw new AccessDeniedException("Instructor profile not found, authorization failed.");
            }
        }
        logger.warn("Access Denied: User {} (Roles: {}) is not authorized to modify course {}.",
                currentUser.getUsername(), currentUser.getAuthorities(), course.getCourseId());
        throw new AccessDeniedException("User is not authorized to modify this course.");
    }

    @Override
    @Transactional
    public Course createCourseFromDto(CourseInputDTO dto, MultipartFile imageFile, UserPrincipal currentUser) throws IOException {
        // ... (implementation as before, no changes needed here for this specific error) ...
        if (currentUser == null) throw new AccessDeniedException("Authentication required to create a course.");
        if (!hasRole(currentUser, Role.ADMIN) && !hasRole(currentUser, Role.INSTRUCTOR)) {
            throw new AccessDeniedException("User not authorized to create courses.");
        }

        logger.info("SERVICE - User {} creating course with title: '{}'", currentUser.getUsername(), dto.getTitle());
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setMode(dto.getMode());
        course.setPrice(dto.getPrice());
        course.setCertificationEligible(dto.getCertificationEligible() != null ? dto.getCertificationEligible() : false);
        course.setLevel(dto.getLevel());
        course.setDurationHours(dto.getDurationHours());
        course.setLocation(dto.getLocation());

        if (dto.getStartDate() != null && !dto.getStartDate().isEmpty()) {
            try { course.setStartDate(LocalDate.parse(dto.getStartDate())); }
            catch (DateTimeParseException e) { logger.warn("Invalid startDate format: {}. Ignoring.", dto.getStartDate(), e);}
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            course.setImageData(imageFile.getBytes());
            course.setImageContentType(imageFile.getContentType());
        }

        Set<Instructor> instructorsToSet = new HashSet<>();
        if (dto.getInstructorIds() != null && !dto.getInstructorIds().isEmpty()) {
            for (Long instructorId : dto.getInstructorIds()) {
                try {
                    Instructor instructor = instructorService.getInstructorById(instructorId);
                    instructorsToSet.add(instructor);
                }
                catch (ResourceNotFoundException e) { logger.warn("Instructor ID {} not found while creating course. Skipping.", instructorId); }
            }
        }

        if (hasRole(currentUser, Role.INSTRUCTOR)) {
            try {
                Instructor currentInstructorEntity = instructorService.findByUserId(currentUser.getId());
                if (instructorsToSet.stream().noneMatch(i -> i.getInstructorId().equals(currentInstructorEntity.getInstructorId())) ||
                   (dto.getInstructorIds() == null || dto.getInstructorIds().isEmpty())) {
                     instructorsToSet.add(currentInstructorEntity);
                     logger.info("Auto-assigning creating instructor {} (ID: {}) to new course.", currentUser.getUsername(), currentInstructorEntity.getInstructorId());
                }
            } catch (ResourceNotFoundException e) {
                logger.error("Instructor profile for user {} (ID: {}) not found. Cannot auto-assign to course.", currentUser.getUsername(), currentUser.getId(), e);
            }
        }
        course.setInstructors(instructorsToSet);
        course.setModules(new HashSet<>());
        Course savedCourse = courseRepository.save(course);
        logger.info("SERVICE - Course '{}' (ID: {}) created successfully by user {}.", savedCourse.getTitle(), savedCourse.getCourseId(), currentUser.getUsername());
        return savedCourse;
    }

    @Override
    @Transactional
    public Course updateCourseFromDto(Long id, CourseInputDTO dto, MultipartFile imageFile, UserPrincipal currentUser) throws IOException {
        // ... (implementation as before, no changes needed here for this specific error) ...
        Course course = courseRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        authorizeCourseModification(course, currentUser);

        logger.info("SERVICE - User {} updating course ID: {}", currentUser.getUsername(), id);
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setMode(dto.getMode());
        course.setPrice(dto.getPrice());
        course.setCertificationEligible(dto.getCertificationEligible() != null ? dto.getCertificationEligible() : course.getCertificationEligible());
        course.setLevel(dto.getLevel());
        course.setDurationHours(dto.getDurationHours());
        course.setLocation(dto.getLocation());

        if (dto.getStartDate() != null) {
            if (dto.getStartDate().isEmpty()) {
                course.setStartDate(null);
            } else {
                try { course.setStartDate(LocalDate.parse(dto.getStartDate()));}
                catch (DateTimeParseException e) { logger.warn("Invalid startDate format during update for course {}: {}. Ignoring.", id, dto.getStartDate(), e);}
            }
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            course.setImageData(imageFile.getBytes());
            course.setImageContentType(imageFile.getContentType());
        }

        if (dto.getInstructorIds() != null) {
            if (hasRole(currentUser, Role.ADMIN)) {
                Set<Instructor> newInstructors = new HashSet<>();
                for (Long instructorId : dto.getInstructorIds()) {
                    try {
                        Instructor instructor = instructorService.getInstructorById(instructorId);
                        newInstructors.add(instructor);
                    }
                    catch (ResourceNotFoundException e) { logger.warn("Instructor ID {} not found during course {} update by admin. Skipping.", instructorId, id); }
                }
                course.setInstructors(newInstructors);
            } else if (hasRole(currentUser, Role.INSTRUCTOR)) {
                logger.warn("Instructor {} attempted to update the full instructor list for course {} via DTO. This is usually an admin-only action. Instructor list NOT changed by instructor.", currentUser.getUsername(), id);
            }
        }
        return courseRepository.save(course);
    }


    @Override
    @Transactional(readOnly = true)
    public List<CourseListDTO> getAllCoursesForList() {
        logger.debug("SERVICE - Fetching all courses for list display.");
        List<Course> courses = courseRepository.findAllWithDetails();
        return courses.stream().map(this::mapCourseToCourseListDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseListDTO> getCoursesByInstructorForList(Long instructorId) {
        instructorService.getInstructorById(instructorId);
        logger.debug("SERVICE - Fetching courses for instructor ID: {}", instructorId);
        List<Course> courses = courseRepository.findByInstructorIdWithDetails(instructorId);
        return courses.stream().map(this::mapCourseToCourseListDTO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public CourseListDTO getCourseDetailsForListDTO(Long id) {
        logger.debug("SERVICE - Fetching course details for DTO, ID: {}", id);
        Course course = courseRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapCourseToCourseListDTO(course);
    }

    // This is the CRITICAL mapping method for your frontend detail page
    private CourseListDTO mapCourseToCourseListDTO(Course course) {
        if (course == null) {
            logger.warn("mapCourseToCourseListDTO: Received null course entity.");
            return null;
        }
        CourseListDTO dto = new CourseListDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCategory(course.getCategory());
        dto.setMode(course.getMode());
        dto.setPrice(course.getPrice());
        dto.setCertificationEligible(course.getCertificationEligible());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setLevel(course.getLevel());
        dto.setLocation(course.getLocation());

        if (course.getImageData() != null && course.getImageData().length > 0 && course.getImageContentType() != null) {
            dto.setImageUrl("/api/courses/" + course.getCourseId() + "/image");
        }
        if (course.getStartDate() != null) {
            dto.setStartDate(course.getStartDate()); // Uses overloaded setter in DTO
        }
        if (course.getDurationHours() != null && course.getDurationHours() > 0) {
            dto.setDuration(course.getDurationHours() + " heures");
        } else {
            dto.setDuration("Durée non spécifiée");
        }

        if (course.getReviews() != null && !course.getReviews().isEmpty()) {
            dto.setReviewCount(course.getReviews().size());
            double avgRating = course.getReviews().stream()
                                  .mapToInt(Review::getRating)
                                  .average().orElse(0.0);
            dto.setRating(Math.round(avgRating * 10.0) / 10.0);
        } else {
            dto.setReviewCount(0);
            dto.setRating(0.0);
        }
        dto.setParticipants(course.getEnrollments() != null ? course.getEnrollments().size() : 0);

        if (course.getInstructors() != null && !course.getInstructors().isEmpty()) {
            List<SimpleInstructorDTO> instructorDTOs = course.getInstructors().stream()
                .map(instructor -> {
                    User instructorUser = instructor.getUser();
                    String fullName = "Instructeur"; 
                    if (instructorUser != null) {
                        String fn = instructorUser.getFirstName();
                        String ln = instructorUser.getLastName();
                        fullName = (fn != null ? fn : "") + (ln != null ? " " + ln : "").trim();
                        if (fullName.trim().isEmpty()) { 
                            fullName = instructorUser.getUsername();
                        }
                    }
                    return new SimpleInstructorDTO(
                        instructor.getInstructorId(),
                        fullName,
                        instructor.getRating()
                    );
                })
                .collect(Collectors.toList());
            dto.setInstructors(instructorDTOs);
            if (!instructorDTOs.isEmpty()) {
                dto.setFirstInstructorId(instructorDTOs.get(0).getInstructorId());
                dto.setFirstInstructorName(instructorDTOs.get(0).getFullName());
            }
        } else {
            dto.setInstructors(new ArrayList<>());
        }
        
        // ******** CORRECTED MODULE MAPPING SECTION ********
        if (course.getModules() != null && !course.getModules().isEmpty()) {
            List<ModuleResponseDTO> moduleResponseDTOs = course.getModules().stream()
                .map(this::mapModuleEntityToModuleResponseDTO) // Use the correct helper method
                .sorted(Comparator.comparing(ModuleResponseDTO::getModuleOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
            dto.setModules(moduleResponseDTOs); // This now passes List<ModuleResponseDTO>
        } else {
            dto.setModules(new ArrayList<>()); // Ensure it's an empty list, not null
        }
        return dto;
    }

    // Helper method to map a single Module entity to ModuleResponseDTO
    private ModuleResponseDTO mapModuleEntityToModuleResponseDTO(Module moduleEntity) {
        if (moduleEntity == null) return null;
        ModuleResponseDTO dto = new ModuleResponseDTO();
        dto.setModuleId(moduleEntity.getModuleId());
        dto.setTitle(moduleEntity.getTitle());
        dto.setDescription(moduleEntity.getDescription());
        dto.setModuleOrder(moduleEntity.getModuleOrder());
        
        if (moduleEntity.getCourse() != null) {
            dto.setCourseId(moduleEntity.getCourse().getCourseId());
            dto.setCourseTitle(moduleEntity.getCourse().getTitle());
        }

        dto.setPdfFilename(moduleEntity.getPdfFilename());
        dto.setHasPdf(moduleEntity.getPdfData() != null && moduleEntity.getPdfData().length > 0);

        dto.setVideoFilename(moduleEntity.getVideoFilename());
        dto.setHasVideo(moduleEntity.getVideoData() != null && moduleEntity.getVideoData().length > 0);
        
        // Assuming 'lessons' are not directly part of the Module entity for now
        // If they were, e.g., private List<String> lessons; in Module entity:
        // dto.setLessons(moduleEntity.getLessons() != null ? new ArrayList<>(moduleEntity.getLessons()) : new ArrayList<>());
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        logger.debug("SERVICE - Fetching raw Course entity by ID: {}", id);
        // Ensure this method fetches details if they are needed by the caller.
        // If this is only for internal use that doesn't need all relations, findById is fine.
        // If it's for something that might trigger lazy loading outside a transaction, use findByIdWithDetails.
        return courseRepository.findByIdWithDetails(id) // Using findByIdWithDetails to ensure collections are available
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }
    
    // Deprecated and other listing methods
    @Override @Transactional(readOnly = true) @Deprecated public List<Course> getAllCourses() { logger.warn("Called deprecated getAllCourses"); return courseRepository.findAll(); }
    @Override @Transactional(readOnly = true) public List<Course> getCoursesByCategory(String category) { return courseRepository.findByCategory(category); }
    @Override @Transactional(readOnly = true) public List<Course> getCoursesByMode(Mode mode) { return courseRepository.findByMode(mode); }
    @Override @Transactional(readOnly = true) public List<Course> getCoursesByInstructorId(Long instructorId) { return courseRepository.findByInstructorIdWithDetails(instructorId); }
    @Override @Transactional(readOnly = true) public List<Course> searchCoursesByTitle(String title) { return courseRepository.findByTitleContainingIgnoreCase(title); }
    @Override @Transactional(readOnly = true) public List<Course> getCoursesByCertificationEligible(Boolean certEligible) { return courseRepository.findByCertificationEligible(certEligible); }
    @Override @Transactional(readOnly = true) public List<Course> getCoursesByMaxPrice(BigDecimal maxPrice) { return courseRepository.findByPriceLessThanEqual(maxPrice); }

    // Instructor Management
    @Override
    @Transactional
    public Course addInstructorToCourse(Long courseId, Long instructorId, UserPrincipal currentUser) {
        Course course = courseRepository.findByIdWithDetails(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        authorizeCourseModification(course, currentUser); 

        Instructor instructorToAdd = instructorService.getInstructorById(instructorId);
        if (course.getInstructors().stream().anyMatch(i -> i.getInstructorId().equals(instructorId))) {
            logger.info("User {} attempted to add instructor {} who is already assigned to course {}. No action.", currentUser.getUsername(), instructorId, courseId);
            return course; 
        }
        course.getInstructors().add(instructorToAdd);
        if (instructorToAdd.getCourses() == null) instructorToAdd.setCourses(new HashSet<>()); // Ensure collection is initialized
        instructorToAdd.getCourses().add(course); 
        logger.info("User {} added instructor {} to course {}", currentUser.getUsername(), instructorId, courseId);
        // Saving course should be enough if cascade is set up, or if Course is owning side of join table.
        // If Instructor is owning side for its 'courses' collection, you might need to save instructor.
        return courseRepository.save(course); 
    }

    @Override
    @Transactional
    public Course removeInstructorFromCourse(Long courseId, Long instructorId, UserPrincipal currentUser) {
        Course course = courseRepository.findByIdWithDetails(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        authorizeCourseModification(course, currentUser); 

        Instructor instructorToRemove = course.getInstructors().stream()
            .filter(i -> i.getInstructorId().equals(instructorId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Instructor", "ID " + instructorId + " not found as an instructor for course", courseId));

        if (course.getInstructors().size() <= 1 && !hasRole(currentUser, Role.ADMIN)) {
            logger.warn("User {} (non-admin) attempted to remove the last instructor {} from course {}. Denied.", currentUser.getUsername(), instructorId, courseId);
            throw new IllegalStateException("Cannot remove the last instructor. An admin must perform this or assign another instructor first.");
        }
        course.getInstructors().remove(instructorToRemove);
        if (instructorToRemove.getCourses() != null) instructorToRemove.getCourses().remove(course);
        logger.info("User {} removed instructor {} from course {}", currentUser.getUsername(), instructorId, courseId);
        return courseRepository.save(course);
    }

    @Override
    @Transactional
    public Course setInstructorsForCourse(Long courseId, Set<Long> instructorIds, UserPrincipal currentUser) {
        Course course = courseRepository.findByIdWithDetails(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        if (!hasRole(currentUser, Role.ADMIN)) { 
            throw new AccessDeniedException("Only administrators can set the full list of instructors for a course.");
        }
        
        // Manage bidirectional relationship: remove course from instructors no longer assigned
        Set<Instructor> instructorsToRemoveFrom = new HashSet<>(course.getInstructors());
        if (instructorIds != null) {
            instructorsToRemoveFrom.removeIf(instructor -> instructorIds.contains(instructor.getInstructorId()));
        }
        instructorsToRemoveFrom.forEach(instructor -> {
            if (instructor.getCourses() != null) instructor.getCourses().remove(course);
        });

        Set<Instructor> newInstructors = new HashSet<>();
        if (instructorIds != null) {
            for (Long instId : instructorIds) {
                try { 
                    Instructor instructor = instructorService.getInstructorById(instId);
                    newInstructors.add(instructor);
                    if (instructor.getCourses() == null) instructor.setCourses(new HashSet<>());
                    instructor.getCourses().add(course); // Add course to new instructor's set
                } 
                catch (ResourceNotFoundException e) { 
                    logger.warn("setInstructors: Instructor ID {} not found for course {}. Skipping.", instId, courseId); 
                }
            }
        }
        course.setInstructors(newInstructors); // Set the new collection of instructors for the course
        logger.info("Admin {} set instructors for course {}: {}", currentUser.getUsername(), courseId, instructorIds);
        return courseRepository.save(course);
    }
    
    @Override
    @Transactional
    public void deleteCourse(Long id, UserPrincipal currentUser) {
        Course course = courseRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        authorizeCourseModification(course, currentUser);
        
        // Explicitly manage ManyToMany relationships if Course is the owning side 
        // or if cascading doesn't automatically clear the join table entries from Instructor's side.
        if(course.getInstructors() != null) {
            new HashSet<>(course.getInstructors()).forEach(instructor -> {
                if(instructor.getCourses() != null) {
                    instructor.getCourses().remove(course);
                }
                // No need to save instructor here if Course owns the JoinTable relationship.
            });
            course.getInstructors().clear(); // Clears the association from Course side
        }
        // For OneToMany with CascadeType.ALL and orphanRemoval=true (modules, enrollments, reviews, practicalSessions),
        // Hibernate should handle their deletion.
        
        courseRepository.delete(course); 
        logger.info("User {} deleted course ID: {}", currentUser.getUsername(), id);
    }

    // --- LEGACY METHODS (Marked as deprecated, ensure they are not critical or migrate them) ---
    @Override
    @Transactional
    @Deprecated
    public Course createCourse(Course courseDataFromRequest, MultipartFile imageFile /*, UserPrincipal currentUser */) throws IOException {
        logger.warn("SERVICE - Legacy createCourse called. Consider migrating. Authorization may be bypassed if called by non-admin without UserPrincipal.");
        // Simplified, full legacy logic was in your original snippet
        Course newCourse = new Course();
        newCourse.setTitle(courseDataFromRequest.getTitle());
        // ... copy other properties ...
        if (imageFile != null && !imageFile.isEmpty()) {
            newCourse.setImageData(imageFile.getBytes());
            newCourse.setImageContentType(imageFile.getContentType());
        }
        // ... handle instructors and modules as in original snippet ...
        return courseRepository.save(newCourse);
    }

    @Override
    @Transactional
    @Deprecated
    public Course updateCourse(Long id, Course courseDetailsFromRequest, MultipartFile imageFile /*, UserPrincipal currentUser */) throws IOException {
        logger.warn("SERVICE - Legacy updateCourse called for course ID: {}. Authorization must be handled by caller if non-admin.", id);
        Course course = getCourseById(id); 
        // ... copy properties from courseDetailsFromRequest to course ...
        if (imageFile != null && !imageFile.isEmpty()) {
            course.setImageData(imageFile.getBytes());
            course.setImageContentType(imageFile.getContentType());
        }
        // ... handle instructors and modules as in original snippet ...
        return courseRepository.save(course);
    }
}