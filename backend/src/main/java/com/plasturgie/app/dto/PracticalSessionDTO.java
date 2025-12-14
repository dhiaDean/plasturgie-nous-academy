package com.plasturgie.app.dto; // Or your appropriate DTO package

import com.plasturgie.app.model.enums.PracticalSessionStatus;
import java.time.LocalDateTime;

public class PracticalSessionDTO {

    private Long id;
    private String title;
    private String description; // Optional: may not be needed for list views
    private LocalDateTime sessionDateTime; // You might send this as is, or...
    private String sessionDateTimeFormatted; // ...a pre-formatted string for easier display
    private String location;
    private Integer durationMinutes;
    private PracticalSessionStatus status;

    // Information from related entities (good for display, avoids extra frontend calls)
    private Long courseId;
    private String courseTitle; // e.g., "Injection Molding Lab Session"
    private String courseSubTitle; // e.g., "Introduction to Injection Molding" from your mockup

    private Long conductingInstructorId;
    private String conductingInstructorName; // e.g., "Dr. Anya Petrova"
    private String conductingInstructorAvatarUrl; // If you have avatar images

    // Getters and Setters (Lombok @Data or manual)

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

    public String getSessionDateTimeFormatted() {
        return sessionDateTimeFormatted;
    }

    public void setSessionDateTimeFormatted(String sessionDateTimeFormatted) {
        this.sessionDateTimeFormatted = sessionDateTimeFormatted;
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseSubTitle() {
        return courseSubTitle;
    }

    public void setCourseSubTitle(String courseSubTitle) {
        this.courseSubTitle = courseSubTitle;
    }

    public Long getConductingInstructorId() {
        return conductingInstructorId;
    }

    public void setConductingInstructorId(Long conductingInstructorId) {
        this.conductingInstructorId = conductingInstructorId;
    }

    public String getConductingInstructorName() {
        return conductingInstructorName;
    }

    public void setConductingInstructorName(String conductingInstructorName) {
        this.conductingInstructorName = conductingInstructorName;
    }

    public String getConductingInstructorAvatarUrl() {
        return conductingInstructorAvatarUrl;
    }

    public void setConductingInstructorAvatarUrl(String conductingInstructorAvatarUrl) {
        this.conductingInstructorAvatarUrl = conductingInstructorAvatarUrl;
    }
}