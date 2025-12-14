package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
// If using JsonIdentityInfo for the class (e.g., for ManyToMany with Instructor)
// import com.fasterxml.jackson.annotation.JsonIdentityInfo;
// import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.plasturgie.app.model.enums.Mode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
// Add ALL lazy-loaded collections to exclude to prevent LazyInitializationException from Lombok methods
@EqualsAndHashCode(exclude = {"instructors", "enrollments", "reviews", "modules", "practicalSessions", "certifications"}) // Add 'certifications' if Course has OneToMany to Certification
@ToString(exclude = {"instructors", "enrollments", "reviews", "modules", "practicalSessions", "certifications"}) // Same here
// Example of JsonIdentityInfo for the class if used for ManyToMany relationships
// @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "courseId")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "course_seq")
    @SequenceGenerator(name = "course_seq", sequenceName = "course_seq", allocationSize = 1)
    private Long courseId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String description;

    private String category;
    private Integer durationHours;

    @Enumerated(EnumType.STRING)
    private Mode mode;

    private BigDecimal price;

    @Column(name = "certification_eligible")
    private Boolean certificationEligible;

    @Column(length = 50)
    private String level;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column
    private String location;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image_data", columnDefinition="BLOB")
    private byte[] imageData; // Jackson serializes byte[] to Base64 string by default

    @Column(name = "image_content_type", length = 100)
    private String imageContentType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "course_instructors",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "instructor_id"))
    // Option 1 for ManyToMany: (Requires Instructor.courses to be @JsonBackReference("course-instructors"))
    @JsonManagedReference("course-instructors")
    // Option 2: Remove above and use @JsonIdentityInfo on both Course and Instructor classes
    private Set<Instructor> instructors = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("course-enrollments")
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("course-reviews")
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("moduleOrder ASC")
    @JsonManagedReference("course-modules") // You had this, ensure name matches Module.course
    private Set<Module> modules = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sessionDateTime ASC")
    @JsonManagedReference("course-practicalSessions")
    private Set<PracticalSession> practicalSessions = new HashSet<>();

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

	public Integer getDurationHours() {
		return durationHours;
	}

	public void setDurationHours(Integer durationHours) {
		this.durationHours = durationHours;
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

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public byte[] getImageData() {
		return imageData;
	}

	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}

	public String getImageContentType() {
		return imageContentType;
	}

	public void setImageContentType(String imageContentType) {
		this.imageContentType = imageContentType;
	}

	public Set<Instructor> getInstructors() {
		return instructors;
	}

	public void setInstructors(Set<Instructor> instructors) {
		this.instructors = instructors;
	}

	public Set<Enrollment> getEnrollments() {
		return enrollments;
	}

	public void setEnrollments(Set<Enrollment> enrollments) {
		this.enrollments = enrollments;
	}

	public Set<Review> getReviews() {
		return reviews;
	}

	public void setReviews(Set<Review> reviews) {
		this.reviews = reviews;
	}

	public Set<Module> getModules() {
		return modules;
	}

	public void setModules(Set<Module> modules) {
		this.modules = modules;
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

	public Set<PracticalSession> getPracticalSessions() {
		return practicalSessions;
	}

	public void setPracticalSessions(Set<PracticalSession> practicalSessions) {
		this.practicalSessions = practicalSessions;
	}

    // Example: If a Course can be associated with many Certifications directly
    // (This is different from Certification having a Course)
    /*
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("course-certifications") // Ensure Certification.course has @JsonBackReference("course-certifications")
    private Set<Certification> certifications = new HashSet<>();
    */
    

    // --- Explicit Getters and Setters ---
    // REMOVE these if @Data is present and there's no custom logic.
    // Lombok @Data generates them. Keeping them overrides Lombok.
    /*
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    // ... and so on for all fields and collections
    public Set<PracticalSession> getPracticalSessions() { return practicalSessions; }
    public void setPracticalSessions(Set<PracticalSession> practicalSessions) { this.practicalSessions = practicalSessions; }
    public void addPracticalSession(PracticalSession session) { ... }
    public void removePracticalSession(PracticalSession session) { ... }
    */
}