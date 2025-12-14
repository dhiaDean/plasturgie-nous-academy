package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.Review;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Role; // For authorization
import com.plasturgie.app.repository.ReviewRepository;
import com.plasturgie.app.service.CourseService;
import com.plasturgie.app.service.InstructorService;
import com.plasturgie.app.service.ReviewService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException; // For authorization
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserService userService; // To fetch User entities
    
    @Autowired
    private CourseService courseService; // To fetch Course entities
    
    @Autowired
    private InstructorService instructorService; // To fetch Instructor and update rating

    @Override
    @Transactional
    public Review createCourseReview(Review reviewInput, Long userId, Long courseId) {
        User user = userService.findById(userId);
        Course course = courseService.getCourseById(courseId); // Assumes this fetches a raw Course entity
        
        if (reviewRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new IllegalStateException("User ID " + userId + " has already reviewed course ID " + courseId);
        }
        
        Review newReview = new Review();
        newReview.setUser(user);
        newReview.setCourse(course);
        newReview.setRating(reviewInput.getRating());
        newReview.setComment(reviewInput.getComment());
        // newReview.setCreatedAt will be set by @CreationTimestamp
        
        return reviewRepository.save(newReview);
    }

    @Override
    @Transactional
    public Review createInstructorReview(Review reviewInput, Long userId, Long instructorId) {
        User user = userService.findById(userId);
        Instructor instructor = instructorService.getInstructorById(instructorId);
        
        if (reviewRepository.findByUserAndInstructor(user, instructor).isPresent()) {
            throw new IllegalStateException("User ID " + userId + " has already reviewed instructor ID " + instructorId);
        }
        
        Review newReview = new Review();
        newReview.setUser(user);
        newReview.setInstructor(instructor);
        newReview.setRating(reviewInput.getRating());
        newReview.setComment(reviewInput.getComment());

        Review savedReview = reviewRepository.save(newReview);
        
        instructorService.updateInstructorRating(instructorId); // Recalculate and save instructor rating
        
        return savedReview;
    }

    @Override
    @Transactional(readOnly = true)
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByCourseId(Long courseId) {
        // Course course = courseService.getCourseById(courseId); // Fetching full course might be overkill if repo method takes ID
        return reviewRepository.findByCourse_CourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByInstructorId(Long instructorId) {
        // Instructor instructor = instructorService.getInstructorById(instructorId);
        return reviewRepository.findByInstructor_InstructorId(instructorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByUserId(Long userId) {
        // User user = userService.findById(userId);
        return reviewRepository.findByUser_UserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Review getReviewByUserAndCourse(Long userId, Long courseId) {
        User user = userService.findById(userId);
        Course course = courseService.getCourseById(courseId);
        return reviewRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "user and course IDs",
                        userId + " and " + courseId));
    }

    @Override
    @Transactional(readOnly = true)
    public Review getReviewByUserAndInstructor(Long userId, Long instructorId) {
        User user = userService.findById(userId);
        Instructor instructor = instructorService.getInstructorById(instructorId);
        return reviewRepository.findByUserAndInstructor(user, instructor)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "user and instructor IDs",
                        userId + " and " + instructorId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByRating(Integer rating) {
        return reviewRepository.findByRating(rating);
    }

    @Override
    @Transactional
    public Review updateReview(Long reviewId, Review reviewDetails, Long performingUserId) {
        Review review = getReviewById(reviewId);
        User performingUser = userService.findById(performingUserId);

        // Authorization: Only the user who wrote the review or an ADMIN can update it
        if (!review.getUser().getUserId().equals(performingUserId) && 
            !(performingUser.getRole() == Role.ADMIN)) { // Assuming Role is an enum
            throw new AccessDeniedException("User not authorized to update this review");
        }
        
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        
        Review savedReview = reviewRepository.save(review);
        
        if (review.getInstructor() != null) {
            instructorService.updateInstructorRating(review.getInstructor().getInstructorId());
        }
        // If you also want to update course average rating, do it here or in CourseService
        
        return savedReview;
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long performingUserId) {
        Review review = getReviewById(reviewId);
        User performingUser = userService.findById(performingUserId);

        // Authorization
        if (!review.getUser().getUserId().equals(performingUserId) &&
            !(performingUser.getRole() == Role.ADMIN)) {
            throw new AccessDeniedException("User not authorized to delete this review");
        }
        
        Long instructorIdToUpdate = null;
        if (review.getInstructor() != null) {
            instructorIdToUpdate = review.getInstructor().getInstructorId();
        }
        
        reviewRepository.delete(review);
        
        if (instructorIdToUpdate != null) {
            instructorService.updateInstructorRating(instructorIdToUpdate);
        }
        // If you also want to update course average rating, do it here
    }

    @Override
    @Transactional(readOnly = true)
    public double calculateAverageRatingForCourse(Long courseId) {
        // Course course = courseService.getCourseById(courseId); // Not needed if using findByCourse_CourseId
        List<Review> reviews = reviewRepository.findByCourse_CourseId(courseId);
        
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        return reviews.stream()
                .mapToInt(Review::getRating) // Ensure Review::getRating exists and returns int
                .average()
                .orElse(0.0);
    }

    @Override
    @Transactional(readOnly = true)
    public double calculateAverageRatingForInstructor(Long instructorId) {
        // Instructor instructor = instructorService.getInstructorById(instructorId);
        List<Review> reviews = reviewRepository.findByInstructor_InstructorId(instructorId);
        
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        // Optionally round it here if this method is used for direct display
        return BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}