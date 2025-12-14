package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime; // Or String

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDetailDTO {
    private Long reviewId;
    private SimpleUserDTO user; // Assuming SimpleUserDTO is defined with userId, username, etc.
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt; // Or String (e.g., "YYYY-MM-DDTHH:mm:ss")
	public Long getReviewId() {
		return reviewId;
	}
	public void setReviewId(Long reviewId) {
		this.reviewId = reviewId;
	}
	public SimpleUserDTO getUser() {
		return user;
	}
	public void setUser(SimpleUserDTO user) {
		this.user = user;
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
}