package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor // Generates constructor with all fields
public class ReviewDTO {

    // Fields declared FIRST
    private Long reviewId;
    private Long userId;
    private String username;
    private Long courseId;
    private Long instructorId;
    private String reviewedItemName;
    private String reviewedItemType;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotBlank(message = "Comment cannot be empty")
    private String comment;

    private LocalDateTime createdAt;

	public Long getReviewId() {
		return reviewId;
	}

	public void setReviewId(Long reviewId) {
		this.reviewId = reviewId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public Long getInstructorId() {
		return instructorId;
	}

	public void setInstructorId(Long instructorId) {
		this.instructorId = instructorId;
	}

	public String getReviewedItemName() {
		return reviewedItemName;
	}

	public void setReviewedItemName(String reviewedItemName) {
		this.reviewedItemName = reviewedItemName;
	}

	public String getReviewedItemType() {
		return reviewedItemType;
	}

	public void setReviewedItemType(String reviewedItemType) {
		this.reviewedItemType = reviewedItemType;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    // NO explicit getters/setters needed here if @Data is used
    // If you remove @Data, you would need to add them all explicitly.
}