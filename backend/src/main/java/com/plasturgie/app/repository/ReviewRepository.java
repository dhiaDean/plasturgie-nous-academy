package com.plasturgie.app.repository;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.Review;
import com.plasturgie.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByUserAndCourse(User user, Course course);
    Optional<Review> findByUserAndInstructor(User user, Instructor instructor);

    List<Review> findByCourse(Course course);
    List<Review> findByInstructor(Instructor instructor);
    List<Review> findByUser(User user);
    List<Review> findByRating(Integer rating);

    // For convenience with IDs
    List<Review> findByCourse_CourseId(Long courseId);
    List<Review> findByInstructor_InstructorId(Long instructorId);
    List<Review> findByUser_UserId(Long userId);
}