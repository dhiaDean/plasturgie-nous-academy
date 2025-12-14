package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
// If using JsonIdentityInfo for courses:
// import com.fasterxml.jackson.annotation.JsonIdentityInfo;
// import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "instructors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
// Add all LAZY collections here
@EqualsAndHashCode(exclude = {"user", "courses", "reviews", "conductedPracticalSessions"})
@ToString(exclude = {"user", "courses", "reviews", "conductedPracticalSessions"})
// If using @JsonIdentityInfo for this entity (e.g., for courses ManyToMany)
// @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "instructorId")
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "instructor_seq")
    @SequenceGenerator(name = "instructor_seq", sequenceName = "instructor_seq", allocationSize = 1)
    private Long instructorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId", unique = true, nullable = false)
    @JsonBackReference("user-instructorProfile") // Matches User.instructorProfile
    private User user;

    @Column(columnDefinition = "CLOB")
    private String bio;

    private String expertise;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @ManyToMany(mappedBy = "instructors", fetch = FetchType.LAZY)
    // For ManyToMany, @JsonIdentityInfo on both Course and Instructor is often preferred.
    // OR, pick one side to manage, other to back-reference (can be tricky for ManyToMany)
    // OR, @JsonIgnore on this side if you don't need to list courses when serializing an Instructor.
    // Assuming Course.instructors has @JsonManagedReference("course-instructors")
    @JsonBackReference("course-instructors") // This requires Course.instructors to be @JsonManagedReference
    private Set<Course> courses = new HashSet<>();

    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("instructor-reviews") // Ensure Review.instructor has @JsonBackReference("instructor-reviews")
    private Set<Review> reviews = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "conductingInstructor", fetch = FetchType.LAZY)
    @JsonManagedReference("instructor-conductedPracticalSessions")
    private Set<PracticalSession> conductedPracticalSessions = new HashSet<>();

	public Long getInstructorId() {
		return instructorId;
	}

	public void setInstructorId(Long instructorId) {
		this.instructorId = instructorId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public BigDecimal getRating() {
		return rating;
	}

	public void setRating(BigDecimal rating) {
		this.rating = rating;
	}

	public Set<Course> getCourses() {
		return courses;
	}

	public void setCourses(Set<Course> courses) {
		this.courses = courses;
	}

	public Set<Review> getReviews() {
		return reviews;
	}

	public void setReviews(Set<Review> reviews) {
		this.reviews = reviews;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Set<PracticalSession> getConductedPracticalSessions() {
		return conductedPracticalSessions;
	}

	public void setConductedPracticalSessions(Set<PracticalSession> conductedPracticalSessions) {
		this.conductedPracticalSessions = conductedPracticalSessions;
	}

    // Lombok's @Data provides getters and setters. Remove explicit ones.
}