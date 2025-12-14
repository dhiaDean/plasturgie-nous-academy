package com.plasturgie.app.repository;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.PracticalSession;
import com.plasturgie.app.model.enums.PracticalSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PracticalSessionRepository extends JpaRepository<PracticalSession, Long> {

    // --- Methods directly used by the provided PracticalSessionServiceImpl ---

    // Used in PracticalSessionServiceImpl's getPracticalSessionsByCourseId method
    List<PracticalSession> findByCourseCourseIdOrderBySessionDateTimeAsc(Long courseId); // <<< THIS IS THE KEY METHOD

    // Used in PracticalSessionServiceImpl's getUpcomingPracticalSessionsForUser method
    List<PracticalSession> findByCourseCourseIdInAndStatusOrderBySessionDateTimeAsc(List<Long> courseIds, PracticalSessionStatus status);

    // Used in PracticalSessionServiceImpl's getPracticalSessionsForInstructorDashboard method
    List<PracticalSession> findByConductingInstructorInstructorIdOrderBySessionDateTimeAsc(Long instructorId);


    // --- Other potentially useful methods (keep if used elsewhere or for future needs) ---
    List<PracticalSession> findByCourse(Course course);
    // List<PracticalSession> findByCourseCourseId(Long courseId); // This one is superseded by the OrderBy version above for the service's needs
    List<PracticalSession> findByConductingInstructor(Instructor instructor);
    // List<PracticalSession> findByConductingInstructorInstructorId(Long instructorId); // This one is superseded by the OrderBy version above for the service's needs
}