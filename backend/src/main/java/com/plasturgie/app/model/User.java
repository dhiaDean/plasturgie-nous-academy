package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference; // Import
import com.plasturgie.app.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode; // Import for consistency if needed
import lombok.ToString;        // Import for consistency if needed
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(exclude = {"eventRegistrations"}) // Exclude collections from lombok-generated equals/hashCode
@ToString(exclude = {"eventRegistrations"})      // Exclude collections from lombok-generated toString
public class User {
	  @Id
	  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
	  @SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
	  private Long userId;
    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash; // Consider @JsonIgnore for this field in responses

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "jwt_token")
    @JsonIgnore
    private String jwtToken; // Consider @JsonIgnore for this field in responses

    @Column(name = "token_expiry")
    @JsonIgnore
    private LocalDateTime tokenExpiry; // Consider @JsonIgnore for this field in responses

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("user-eventRegistrations")
    private Set<EventRegistration> eventRegistrations = new HashSet<>();
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

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
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

	public String getJwtToken() {
		return jwtToken;
	}

	public void setJwtToken(String jwtToken) {
		this.jwtToken = jwtToken;
	}

	public LocalDateTime getTokenExpiry() {
		return tokenExpiry;
	}

	public void setTokenExpiry(LocalDateTime tokenExpiry) {
		this.tokenExpiry = tokenExpiry;
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

	public Set<EventRegistration> getEventRegistrations() {
		return eventRegistrations;
	}

	public void setEventRegistrations(Set<EventRegistration> eventRegistrations) {
		this.eventRegistrations = eventRegistrations;
	}
    
    // Explicit getters and setters are generally not needed with Lombok's @Data
    // unless you have custom logic within them.
    // Lombok will generate them based on field names.
    // If you explicitly define them, ensure they match what Lombok would generate
    // or remove them and let Lombok handle it.
    // For brevity and relying on Lombok, I'll comment out the explicit ones if @Data is present.
    /*
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    // ... etc. for all fields
    public Set<EventRegistration> getEventRegistrations() { return eventRegistrations; }
    public void setEventRegistrations(Set<EventRegistration> eventRegistrations) { this.eventRegistrations = eventRegistrations; }
    */
}