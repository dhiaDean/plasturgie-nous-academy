package com.plasturgie.app.service;

import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.Review;
import com.plasturgie.app.model.User; // Import User

import java.util.List;

public interface ReviewService {
    // --- Creation ---
    Review createCourseReview(Review review, Long userId, Long courseId);
    Review createInstructorReview(Review review, Long userId, Long instructorId);

    // --- Retrieval ---
    Review getReviewById(Long id);
    List<Review> getReviewsByCourseId(Long courseId); // Changed to use ID
    List<Review> getReviewsByInstructorId(Long instructorId); // Changed to use ID
    List<Review> getReviewsByUserId(Long userId); // Changed to use ID
    Review getReviewByUserAndCourse(Long userId, Long courseId); // Changed to use IDs
    Review getReviewByUserAndInstructor(Long userId, Long instructorId); // Changed to use IDs
    List<Review> getReviewsByRating(Integer rating);

    // --- Update & Delete ---
    Review updateReview(Long id, Review reviewDetails, Long performingUserId); // Added performingUserId for auth check
    void deleteReview(Long id, Long performingUserId); // Added performingUserId for auth check

    // --- Aggregation (These might be better in their respective services or via repository methods) ---
    double calculateAverageRatingForCourse(Long courseId);
    double calculateAverageRatingForInstructor(Long instructorId); // This one is good here if ReviewService owns it
}