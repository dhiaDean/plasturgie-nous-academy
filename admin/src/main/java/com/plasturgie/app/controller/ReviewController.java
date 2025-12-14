package com.plasturgie.app.controller;

import com.plasturgie.app.dto.ReviewDTO;
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Review;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    private ReviewDTO convertToDto(Review review) {
        if (review == null) return null;
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getUserId());
            dto.setUsername(review.getUser().getUsername());
        }
        if (review.getCourse() != null) {
            dto.setCourseId(review.getCourse().getCourseId());
            dto.setReviewedItemName(review.getCourse().getTitle());
            dto.setReviewedItemType("COURSE");
        } else if (review.getInstructor() != null) {
            dto.setInstructorId(review.getInstructor().getInstructorId());
            if (review.getInstructor().getUser() != null) {
                 dto.setReviewedItemName(
                    (review.getInstructor().getUser().getFirstName() != null ? review.getInstructor().getUser().getFirstName().trim() : "") +
                    (review.getInstructor().getUser().getLastName() != null ? " " + review.getInstructor().getUser().getLastName().trim() : "")
                );
                // Ensure name is not empty
                if (dto.getReviewedItemName().trim().isEmpty() && review.getInstructor().getUser().getUsername() != null) {
                    dto.setReviewedItemName(review.getInstructor().getUser().getUsername()); // Fallback
                } else if (dto.getReviewedItemName().trim().isEmpty()) {
                    dto.setReviewedItemName("Instructor " + review.getInstructor().getInstructorId()); // Fallback
                }
            } else {
                dto.setReviewedItemName("Instructor " + review.getInstructor().getInstructorId());
            }
            dto.setReviewedItemType("INSTRUCTOR");
        }
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    private List<ReviewDTO> convertToDtoList(List<Review> reviews) {
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN') or hasRole('COMPANY_REP')")
    public ResponseEntity<ReviewDTO> createCourseReview(
            @PathVariable Long courseId,
            @Valid @RequestBody ReviewDTO reviewDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            Review reviewInput = new Review();
            reviewInput.setRating(reviewDto.getRating());
            reviewInput.setComment(reviewDto.getComment());

            Review newReview = reviewService.createCourseReview(reviewInput, currentUser.getId(), courseId); // Fixed: getId()
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(newReview));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Provide null or error DTO
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN') or hasRole('COMPANY_REP')")
    public ResponseEntity<ReviewDTO> createInstructorReview(
            @PathVariable Long instructorId,
            @Valid @RequestBody ReviewDTO reviewDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            Review reviewInput = new Review();
            reviewInput.setRating(reviewDto.getRating());
            reviewInput.setComment(reviewDto.getComment());

            Review newReview = reviewService.createInstructorReview(reviewInput, currentUser.getId(), instructorId); // Fixed: getId()
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(newReview));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Provide null or error DTO
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            return ResponseEntity.ok(convertToDto(review));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByCourseId(@PathVariable Long courseId) {
        List<Review> reviews = reviewService.getReviewsByCourseId(courseId);
        return ResponseEntity.ok(convertToDtoList(reviews));
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByInstructorId(@PathVariable Long instructorId) {
        List<Review> reviews = reviewService.getReviewsByInstructorId(instructorId);
        return ResponseEntity.ok(convertToDtoList(reviews));
    }

    @GetMapping("/user/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewDTO>> getMyReviews(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Review> reviews = reviewService.getReviewsByUserId(currentUser.getId()); // Fixed: getId()
        return ResponseEntity.ok(convertToDtoList(reviews));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == principal.id") // Fixed: principal.id
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(convertToDtoList(reviews));
    }

    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRating(@PathVariable Integer rating) {
        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }
        List<Review> reviews = reviewService.getReviewsByRating(rating);
        return ResponseEntity.ok(convertToDtoList(reviews));
    }

    @GetMapping("/course/{courseId}/average")
    public ResponseEntity<Double> getAverageRatingForCourse(@PathVariable Long courseId) {
        try {
            double averageRating = reviewService.calculateAverageRatingForCourse(courseId);
            return ResponseEntity.ok(averageRating);
        } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/instructor/{instructorId}/average")
    public ResponseEntity<Double> getAverageRatingForInstructor(@PathVariable Long instructorId) {
         try {
            double averageRating = reviewService.calculateAverageRatingForInstructor(instructorId);
            return ResponseEntity.ok(averageRating);
        } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            Review reviewDetails = new Review();
            reviewDetails.setRating(reviewDto.getRating());
            reviewDetails.setComment(reviewDto.getComment());

            Review updatedReview = reviewService.updateReview(reviewId, reviewDetails, currentUser.getId()); // Fixed: getId()
            return ResponseEntity.ok(convertToDto(updatedReview));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            reviewService.deleteReview(reviewId, currentUser.getId()); // Fixed: getId()
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}