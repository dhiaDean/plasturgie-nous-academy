package com.plasturgie.app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference; // Import
// Other imports from your original file...
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
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(exclude = {"company", "registrations"}) 
@ToString(exclude = {"company", "registrations"})
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_seq")
    @SequenceGenerator(name = "event_seq", sequenceName = "event_seq", allocationSize = 1)
    private Long eventId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String description;

    private String location;
    
    @Column(name = "event_date")
    private LocalDateTime eventDate;
    
    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;
    
    private BigDecimal price;
    
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "current_participants", columnDefinition = "integer default 0")
    private Integer currentParticipants = 0;

    @ManyToOne(fetch = FetchType.LAZY) // Already LAZY, good.
    @JoinColumn(name = "company_id")
    // If Company has Set<Event> with @JsonBackReference("company-events"), add:
    // @JsonManagedReference("company-events") 
    private Company company;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Ensure LAZY
    @JsonManagedReference("event-eventRegistrations") // Name for this reference
    private Set<EventRegistration> registrations = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

	public Long getEventId() {
		return eventId;
	}

	public void setEventId(Long eventId) {
		this.eventId = eventId;
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

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public LocalDateTime getEventDate() {
		return eventDate;
	}

	public void setEventDate(LocalDateTime eventDate) {
		this.eventDate = eventDate;
	}

	public LocalDateTime getRegistrationDeadline() {
		return registrationDeadline;
	}

	public void setRegistrationDeadline(LocalDateTime registrationDeadline) {
		this.registrationDeadline = registrationDeadline;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getMaxParticipants() {
		return maxParticipants;
	}

	public void setMaxParticipants(Integer maxParticipants) {
		this.maxParticipants = maxParticipants;
	}

	public Integer getCurrentParticipants() {
		return currentParticipants;
	}

	public void setCurrentParticipants(Integer currentParticipants) {
		this.currentParticipants = currentParticipants;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public Set<EventRegistration> getRegistrations() {
		return registrations;
	}

	public void setRegistrations(Set<EventRegistration> registrations) {
		this.registrations = registrations;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    // Explicit getters/setters commented out, relying on Lombok @Data
    /*
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    // ... etc.
    public Set<EventRegistration> getRegistrations() { return registrations; }
    public void setRegistrations(Set<EventRegistration> registrations) { this.registrations = registrations; }
    */
}