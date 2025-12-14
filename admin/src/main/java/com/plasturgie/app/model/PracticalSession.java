package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.plasturgie.app.model.enums.PracticalSessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "practical_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(exclude = {"course", "conductingInstructor"})
@ToString(exclude = {"course", "conductingInstructor"})
public class PracticalSession {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "practical_session_seq")
    @SequenceGenerator(name = "practical_session_seq", sequenceName = "practical_session_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Column(name = "session_date_time", nullable = false)
    private LocalDateTime sessionDateTime;

    @Column(nullable = false)
    private String location;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticalSessionStatus status = PracticalSessionStatus.UPCOMING;

    // --- Relationships ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference("course-practicalSessions")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducting_instructor_id") // Assuming this can be null
    @JsonBackReference("instructor-conductedPracticalSessions") // <<< CORRECTED: Name matches Instructor.java
    private Instructor conductingInstructor;

    // --- Timestamps ---
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public LocalDateTime getSessionDateTime() {
		return sessionDateTime;
	}

	public void setSessionDateTime(LocalDateTime sessionDateTime) {
		this.sessionDateTime = sessionDateTime;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public PracticalSessionStatus getStatus() {
		return status;
	}

	public void setStatus(PracticalSessionStatus status) {
		this.status = status;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public Instructor getConductingInstructor() {
		return conductingInstructor;
	}

	public void setConductingInstructor(Instructor conductingInstructor) {
		this.conductingInstructor = conductingInstructor;
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

    // Lombok @Data handles getters/setters.
    // Remove explicit getters/setters like getId(), setId(), etc. if no custom logic.
}