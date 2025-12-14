package com.plasturgie.app.dto;

import com.plasturgie.app.model.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
// import lombok.AllArgsConstructor; // You can comment this out or remove it if the explicit one is preferred

import java.time.LocalDateTime;

@Data
@NoArgsConstructor // For cases where a no-args constructor is needed (e.g., some Jackson deserialization)
public class UserListDTO {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private LocalDateTime createdAt;

    // Explicit constructor matching Hibernate's SELECT NEW expectation
    public UserListDTO(Long userId, String username, String email, String firstName, String lastName, Role role, LocalDateTime createdAt) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.createdAt = createdAt;
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

    // Lombok @Data will generate:
    // - All getters (getUserId(), getUsername(), etc.)
    // - All setters (setUserId(Long userId), etc.)
    // - equals()
    // - hashCode()
    // - toString()
    // So, the explicit getters/setters you had before are not necessary if @Data is present.
    // I've removed them here for clarity as @Data handles it.
}