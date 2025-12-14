package com.plasturgie.app.controller;

import com.plasturgie.app.dto.CourseInputDTO;
import com.plasturgie.app.dto.CourseListDTO; // Ensure this DTO matches what mapCourseToCourseListDTO produces
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.enums.Mode;
import com.plasturgie.app.model.enums.Role;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.InstructorService; // If needed for specific controller logic
import com.plasturgie.app.exception.ResourceNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.GrantedAuthority; // Not directly used in hasRole here
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseService courseService;

    @Autowired
    private InstructorService instructorService; // Keep if used, e.g., in legacy create

    // Re-evaluate if this hasRole is needed directly in controller if service handles auth
    // private boolean hasRole(UserPrincipal principal, Role roleEnum) {
    //     if (principal == null || principal.getAuthorities() == null || roleEnum == null) {
    //         return false;
    //     }
    //     String roleName = "ROLE_" + roleEnum.name();
    //     return principal.getAuthorities().stream()
    //             .map(GrantedAuthority::getAuthority)
    //             .anyMatch(roleName::equals);
    // }

    // --- LEGACY ENDPOINTS ---
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, name = "createCourseLegacyMultipart")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createCourseLegacy( // Changed to ResponseEntity<?> for better error handling
            @Valid @RequestPart("course") Course course, // Sending full entity from client is unusual
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("CONTROLLER - Legacy createCourse by {}: {}", currentUser.getUsername(), course.getTitle());
        try {
            // If createCourse needs UserPrincipal for auto-assignment, it should be added to its signature
            Course createdCourseEntity = courseService.createCourse(course, imageFile /*, currentUser */);
            
            // Auto-assign instructor if an instructor creates it (and not an admin)
            // This logic is better suited inside the service's createCourse method.
            // Keeping it here for minimal change to legacy path if service isn't updated.
            if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR")) &&
                !currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                 try {
                     Instructor currentInstructor = instructorService.findByUserId(currentUser.getId());
                     // Check if already associated by the createCourse or if needs explicit add
                     boolean isAssociated = createdCourseEntity.getInstructors().stream()
                                               .anyMatch(inst -> inst.getInstructorId().equals(currentInstructor.getInstructorId()));
                     if(!isAssociated) {
                        // Pass currentUser to addInstructorToCourse
                        courseService.addInstructorToCourse(createdCourseEntity.getCourseId(), currentInstructor.getInstructorId(), currentUser);
                     }
                 } catch (ResourceNotFoundException e) {
                    logger.warn("CONTROLLER - Legacy create: Instructor profile not found for user {}.", currentUser.getUsername());
                 } catch (Exception e) { // Catch broader exceptions for safety
                    logger.error("CONTROLLER - Legacy create: Error auto-associating instructor.", e);
                 }
            }
            CourseListDTO createdCourseDTO = courseService.getCourseDetailsForListDTO(createdCourseEntity.getCourseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourseDTO);
        } catch (AccessDeniedException e) {
            logger.warn("CONTROLLER - Legacy createCourse: Access Denied - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IOException e) {
            logger.error("CONTROLLER - Legacy createCourse: IOException.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing image file.");
        } catch (Exception e) {
            logger.error("CONTROLLER - Legacy createCourse: Error.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating course.");
        }
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, name = "updateCourseLegacyMultipart")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCourseLegacy( // Changed to ResponseEntity<?>
            @PathVariable Long id,
            @Valid @RequestPart("courseDetails") Course courseDetails, // Sending full entity
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("CONTROLLER - Legacy updateCourse ID: {} by User: {}", id, currentUser.getUsername());
        try {
            // The service method updateCourse SHOULD take UserPrincipal for authorization
            // courseService.updateCourse(id, courseDetails, imageFile, currentUser);
            // For now, assuming legacy service method doesn't have it, so pre-check (less ideal)
            Course existingCourse = courseService.getCourseById(id); // Fetch to check ownership if service doesn't
            boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if(!isAdmin && currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))) {
                Instructor currentInstructor = instructorService.findByUserId(currentUser.getId());
                if (existingCourse.getInstructors().stream().noneMatch(i -> i.getInstructorId().equals(currentInstructor.getInstructorId()))) {
                    throw new AccessDeniedException("Instructor not authorized for this legacy course update.");
                }
            }
            courseService.updateCourse(id, courseDetails, imageFile); // Call original legacy method
            CourseListDTO updatedCourseDTO = courseService.getCourseDetailsForListDTO(id);
            return ResponseEntity.ok(updatedCourseDTO);
        } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
          catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
          catch (IOException e) { return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image processing error."); }
          catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating course."); }
    }

    // --- NEW V2 ENDPOINTS ---
    @PostMapping(value = "/v2", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createCourseV2( // Changed to ResponseEntity<?>
            @Valid @RequestPart("courseDto") CourseInputDTO courseInputDto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("CONTROLLER - V2 createCourse by {}: {}",currentUser.getUsername(), courseInputDto.getTitle());
        try {
            Course createdCourseEntity = courseService.createCourseFromDto(courseInputDto, imageFile, currentUser);
            CourseListDTO createdCourseDTO = courseService.getCourseDetailsForListDTO(createdCourseEntity.getCourseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourseDTO);
        } catch (AccessDeniedException e) {
            logger.warn("CONTROLLER - V2 createCourse: Access Denied - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IOException e) {
            logger.error("CONTROLLER - V2 createCourse: IOException.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing image.");
        } catch (Exception e) {
            logger.error("CONTROLLER - V2 createCourse: Error.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating course.");
        }
    }

    @PutMapping(value = "/{id}/v2", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCourseV2( // Changed to ResponseEntity<?>
            @PathVariable Long id,
            @Valid @RequestPart("courseDto") CourseInputDTO courseInputDto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("CONTROLLER - V2 updateCourse ID: {} by User: {}", id, currentUser.getUsername());
        try {
             courseService.updateCourseFromDto(id, courseInputDto, imageFile, currentUser); // Passes currentUser
             CourseListDTO updatedCourseDTO = courseService.getCourseDetailsForListDTO(id);
             return ResponseEntity.ok(updatedCourseDTO);
        } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
          catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
          catch (IOException e) { return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image processing error."); }
          catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating course."); }
    }

    // --- IMAGE SERVING ENDPOINT ---
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getCourseImage(@PathVariable Long id) {
        // ... (this endpoint remains the same, it's public) ...
        try {
            Course course = courseService.getCourseById(id); 
            if (course.getImageData() != null && course.getImageData().length > 0 && course.getImageContentType() != null) {
                HttpHeaders headers = new HttpHeaders();
                try {
                    MediaType mediaType = MediaType.parseMediaType(course.getImageContentType());
                    headers.setContentType(mediaType);
                    return new ResponseEntity<>(course.getImageData(), headers, HttpStatus.OK);
                } catch (InvalidMediaTypeException e) { /* log and return error */ }
            }
            return ResponseEntity.notFound().build();
        } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
          catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); }
    }
 
    // --- GET Endpoints ---
    @GetMapping
    public ResponseEntity<List<CourseListDTO>> getAllCoursesPublic() {
        // This endpoint is for public listing or for admins if no specific admin endpoint.
        // Instructors should use a dedicated endpoint for "their" courses.
        List<CourseListDTO> courses = courseService.getAllCoursesForList();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseListDTO> getCourseDetailsById(@PathVariable Long id) {
        // Public detail view
         try {
            CourseListDTO courseDTO = courseService.getCourseDetailsForListDTO(id);
            return ResponseEntity.ok(courseDTO);
        } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
         }
    }

    @GetMapping("/by-instructor/{instructorId}")
    // @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTRUCTOR') and #instructorId == @instructorServiceImpl.findByUserId(#currentUser.id).instructorId)") // Example complex auth
    @PreAuthorize("isAuthenticated()") // Simpler: let service/frontend handle if it's "my courses"
    public ResponseEntity<List<CourseListDTO>> getCoursesByInstructor(
            @PathVariable Long instructorId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        // Admin can see any instructor's courses.
        // An instructor should ideally only be able to see their own, or this endpoint is for public view of an instructor's courses.
        // If it's for "my courses", a /me/courses endpoint is better.
        // For now, let's assume it's a general query.
        // If instructorId corresponds to currentUser.instructorId, it's effectively "my courses".
        try {
            List<CourseListDTO> courses = courseService.getCoursesByInstructorForList(instructorId);
            return ResponseEntity.ok(courses);
        } catch (ResourceNotFoundException e) { // If instructorId is invalid
            return ResponseEntity.notFound().build();
        }
    }

    // ... (getCoursesByCategory, getCoursesByMode, searchCourses remain public or access controlled by PreAuthorize if needed)
    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<CourseListDTO>> getCoursesByCategory(@PathVariable String category) {
        // Assuming CourseService.getCoursesByCategory now returns List<CourseListDTO> or you map here
        List<Course> courses = courseService.getCoursesByCategory(category);
        // Manual mapping if service returns entities:
        // List<CourseListDTO> dtos = courses.stream().map(c -> courseService.mapCourseToCourseListDTO(c)).collect(Collectors.toList());
        // If getCoursesByCategory is updated to return DTOs, this is simpler. For now, assuming mapping if needed.
        // This is just an example. Ideally, service methods for lists return DTOs.
        // To keep it simple, let's assume a way to get DTOs.
        // If your service returns List<Course>, you'd need to map them to CourseListDTO here or change service.
        // For now, to avoid breaking your existing service signature:
         List<CourseListDTO> courseDTOs = courses.stream()
                                           .map(course -> courseService.getCourseDetailsForListDTO(course.getCourseId())) // Re-fetch as DTO
                                           .collect(Collectors.toList());
        return ResponseEntity.ok(courseDTOs);
    }

    // ... similar for getCoursesByMode, searchCourses if they return List<Course> and you need List<CourseListDTO>

    // --- Instructor Management on a Course ---
    @PostMapping("/{courseId}/instructors/{instructorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')") // Instructor must be authorized for the course (service check)
    public ResponseEntity<?> addInstructorToCourse( // Changed to ResponseEntity<?>
            @PathVariable Long courseId, 
            @PathVariable Long instructorId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
             courseService.addInstructorToCourse(courseId, instructorId, currentUser);
             return ResponseEntity.ok(courseService.getCourseDetailsForListDTO(courseId));
        } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
          catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
          catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding instructor."); }
    }

    @DeleteMapping("/{courseId}/instructors/{instructorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')") // Instructor must be authorized
    public ResponseEntity<?> removeInstructorFromCourse( // Changed to ResponseEntity<?>
            @PathVariable Long courseId, 
            @PathVariable Long instructorId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
         try {
             courseService.removeInstructorFromCourse(courseId, instructorId, currentUser);
             return ResponseEntity.ok(courseService.getCourseDetailsForListDTO(courseId));
         } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
           catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
           catch (IllegalStateException e) { return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());} // e.g. removing last instructor
           catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); }
    }

    @PutMapping("/{courseId}/instructors")
    @PreAuthorize("hasRole('ADMIN')") // Only Admin can set the whole list
    public ResponseEntity<?> setInstructorsForCourse( // Changed to ResponseEntity<?>
            @PathVariable Long courseId, 
            @RequestBody Set<Long> instructorIds,
            @AuthenticationPrincipal UserPrincipal currentUser) {
         try {
             courseService.setInstructorsForCourse(courseId, instructorIds, currentUser);
             return ResponseEntity.ok(courseService.getCourseDetailsForListDTO(courseId));
         } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
           catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
           catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')") // Service layer will verify instructor ownership
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
             courseService.deleteCourse(id, currentUser);
             return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) { return ResponseEntity.notFound().build(); }
          catch (AccessDeniedException e) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); }
          catch (Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); }
    }
}