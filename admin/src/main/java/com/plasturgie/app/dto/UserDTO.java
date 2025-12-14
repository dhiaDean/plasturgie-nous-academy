package com.plasturgie.app.dto;

import com.plasturgie.app.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * WARNING: This DTO includes a password field.
 * It should ONLY be used for INPUT operations like registration or password updates.
 * DO NOT use this DTO as a return type from API endpoints that expose user data,
 * as it would leak the password. Consider using separate Response DTOs without the password field.
 */
@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates public no-args constructor
@AllArgsConstructor // Generates public constructor with all fields
public class UserDTO {

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	private Long userId; // Typically NOT set by client on creation, but needed for updates/responses

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    // Only include if used for INPUT (e.g., registration, password change)
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Size(max = 50, message = "First name cannot exceed 50 characters") // Example validation
    private String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters") // Example validation
    private String lastName;

    private Role role; // Usually set by the server, not the client during registration

    // NO NEED for explicit getters and setters - @Data handles it.
}