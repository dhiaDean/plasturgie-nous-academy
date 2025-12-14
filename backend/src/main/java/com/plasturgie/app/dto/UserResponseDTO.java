// src/main/java/com/plasturgie/app/dto/UserResponseDTO.java
package com.plasturgie.app.dto;

import com.plasturgie.app.model.enums.Role; // Assuming this is your backend Role enum path
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for sending detailed User information in API responses.
 * Excludes sensitive information like password hash or internal tokens.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role; // This should match the Role enum used in your User entity
    private LocalDateTime createdAt; // Jackson will serialize this to an ISO 8601 string by default
    private LocalDateTime updatedAt; // Jackson will serialize this to an ISO 8601 string by default
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

    // Add any other non-sensitive fields you want to expose about a user.
    // For example, if you had an avatar URL:
    // private String avatarUrl;

    // No explicit getters/setters needed due to Lombok @Data
}