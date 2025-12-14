package com.plasturgie.app.service;

import com.plasturgie.app.dto.CourseInputDTO;
import com.plasturgie.app.dto.CourseListDTO;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.enums.Mode;
import com.plasturgie.app.security.UserPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public interface CourseService {

    // Legacy methods - Add UserPrincipal if they can be called by non-admins for modification
    Course createCourse(Course course, MultipartFile imageFile /*, UserPrincipal currentUser */) throws IOException;
    Course updateCourse(Long id, Course courseDetails, MultipartFile imageFile /*, UserPrincipal currentUser */) throws IOException;

    // V2 DTO methods with UserPrincipal
    Course createCourseFromDto(CourseInputDTO courseDto, MultipartFile imageFile, UserPrincipal currentUser) throws IOException;
    Course updateCourseFromDto(Long id, CourseInputDTO courseDto, MultipartFile imageFile, UserPrincipal currentUser) throws IOException;

    // Listing and Detail methods
    List<CourseListDTO> getAllCoursesForList();
    List<CourseListDTO> getCoursesByInstructorForList(Long instructorId); // For specific instructor's courses
    CourseListDTO getCourseDetailsForListDTO(Long id); // Returns DTO with details

    Course getCourseById(Long id); // General purpose entity getter

    // Deprecated, prefer DTO methods for lists
    @Deprecated
    List<Course> getAllCourses();

    // Filtering methods (return entities, controller might map to DTOs if needed for specific views)
    List<Course> getCoursesByCategory(String category);
    List<Course> getCoursesByMode(Mode mode);
    List<Course> getCoursesByInstructorId(Long instructorId); // Service layer method, controller uses getCoursesByInstructorForList
    List<Course> searchCoursesByTitle(String title);
    List<Course> getCoursesByCertificationEligible(Boolean certificationEligible);
    List<Course> getCoursesByMaxPrice(BigDecimal maxPrice);

    // Instructor management for a course - requires UserPrincipal for authorization
    Course addInstructorToCourse(Long courseId, Long instructorId, UserPrincipal currentUser);
    Course removeInstructorFromCourse(Long courseId, Long instructorId, UserPrincipal currentUser);
    Course setInstructorsForCourse(Long courseId, Set<Long> instructorIds, UserPrincipal currentUser);
    
    void deleteCourse(Long id, UserPrincipal currentUser);
}