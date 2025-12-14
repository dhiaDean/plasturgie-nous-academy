package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstructorInputDTO {
    @NotNull(message = "User ID for the instructor is required")
    private Long userId; // ID of the User who IS this instructor

    @NotBlank(message = "Bio cannot be blank")
    private String bio;

    public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getExpertise() {
		return expertise;
	}

	public void setExpertise(String expertise) {
		this.expertise = expertise;
	}

	private String expertise; // e.g., "Plastics Engineering, Injection Molding"
    
    // Rating is typically calculated, not directly set by client on create/update.
    // If you allow admin to set it, you can uncomment this.
    // private BigDecimal rating; 
}