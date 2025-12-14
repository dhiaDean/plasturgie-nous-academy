package com.plasturgie.app.dto; // Or your appropriate DTO package

import com.plasturgie.app.model.enums.PracticalSessionStatus; // Assuming you have this
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class PracticalSessionInputDTO {

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters") // Or use CLOB if very long
    private String description;

    @NotNull(message = "Session date and time are mandatory")
    @FutureOrPresent(message = "Session date and time must be in the present or future")
    private LocalDateTime sessionDateTime;

    @NotBlank(message = "Location is mandatory")
    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;

    @Positive(message = "Duration must be a positive number")
    private Integer durationMinutes; // Optional, in minutes

    // The client needs to provide the ID of the course this session belongs to
    @NotNull(message = "Course ID is mandatory")
    private Long courseId;

    // The client needs to provide the ID of the instructor conducting the session
    @NotNull(message = "Conducting instructor ID is mandatory")
    private Long conductingInstructorId;

    // Status might be set by the system on creation (e.g., to UPCOMING)
    // but could be part of an update DTO if admins/instructors can change it directly.
    // For creation, you might omit this and default it in the service.
    // For update, you might include it.
    private PracticalSessionStatus status; // Example: UPCOMING, COMPLETED, CANCELLED

    // Getters and Setters (Lombok @Data or manual)
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getConductingInstructorId() {
        return conductingInstructorId;
    }

    public void setConductingInstructorId(Long conductingInstructorId) {
        this.conductingInstructorId = conductingInstructorId;
    }

    public PracticalSessionStatus getStatus() {
        return status;
    }

    public void setStatus(PracticalSessionStatus status) {
        this.status = status;
    }
}