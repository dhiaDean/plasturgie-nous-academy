package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.plasturgie.app.model.enums.Status; // Assuming Status is your enum
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(exclude = {"user", "event"})
@ToString(exclude = {"user", "event"})
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_registration_seq")
    @SequenceGenerator(name = "event_registration_seq", sequenceName = "event_registration_seq", allocationSize = 1)
    private Long registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-eventRegistrations") // Matches User.eventRegistrations
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonBackReference("event-registrations") // ASSUMPTION: Event entity has @JsonManagedReference("event-registrations")
    private Event event; // Assuming you have an Event entity

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "attended")
    private Boolean attended = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

	public Long getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(Long registrationId) {
		this.registrationId = registrationId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public LocalDateTime getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(LocalDateTime registrationDate) {
		this.registrationDate = registrationDate;
	}

	public Boolean getAttended() {
		return attended;
	}

	public void setAttended(Boolean attended) {
		this.attended = attended;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    // Lombok's @Data provides getters and setters. Remove explicit ones.
}