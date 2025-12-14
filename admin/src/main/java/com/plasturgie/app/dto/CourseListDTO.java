// src/main/java/com/plasturgie/app/dto/CourseListDTO.java
package com.plasturgie.app.dto;

import com.plasturgie.app.model.enums.Mode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseListDTO {
    // ... other fields remain the same ...
    private Long courseId;
    private String title;
    private String description;
    private String category;
    private Mode mode;
    private BigDecimal price;
    private Boolean certificationEligible;
    private LocalDateTime createdAt;
    private String firstInstructorName;
    private Long firstInstructorId;
    private String imageUrl;
    private String level;
    private String startDate;
    private String duration;
    private Double rating;
    private Integer reviewCount;
    private Integer participants;
    private String location;

    private List<SimpleInstructorDTO> instructors = new ArrayList<>();
    // MODIFIED HERE:
    private List<ModuleResponseDTO> modules = new ArrayList<>(); // Changed from SimpleModuleDTO

    // Overloaded setter for convenience
    public void setStartDate(LocalDate localDate) {
        if (localDate != null) {
            this.startDate = localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        } else {
            this.startDate = null;
        }
    }

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Mode getMode() {
		return mode;
	}

	public void setMode(Mode mode) {
		this.mode = mode;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Boolean getCertificationEligible() {
		return certificationEligible;
	}

	public void setCertificationEligible(Boolean certificationEligible) {
		this.certificationEligible = certificationEligible;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getFirstInstructorName() {
		return firstInstructorName;
	}

	public void setFirstInstructorName(String firstInstructorName) {
		this.firstInstructorName = firstInstructorName;
	}

	public Long getFirstInstructorId() {
		return firstInstructorId;
	}

	public void setFirstInstructorId(Long firstInstructorId) {
		this.firstInstructorId = firstInstructorId;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public Integer getReviewCount() {
		return reviewCount;
	}

	public void setReviewCount(Integer reviewCount) {
		this.reviewCount = reviewCount;
	}

	public Integer getParticipants() {
		return participants;
	}

	public void setParticipants(Integer participants) {
		this.participants = participants;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public List<SimpleInstructorDTO> getInstructors() {
		return instructors;
	}

	public void setInstructors(List<SimpleInstructorDTO> instructors) {
		this.instructors = instructors;
	}

	public List<ModuleResponseDTO> getModules() {
		return modules;
	}

	public void setModules(List<ModuleResponseDTO> modules) {
		this.modules = modules;
	}

    // Lombok @Data generates getters/setters. Remove explicit ones below if no custom logic.
    // For brevity, I'm omitting the explicit getters/setters you had if @Data is present.
    // Make sure they are removed or match what Lombok would do if you keep them.
}