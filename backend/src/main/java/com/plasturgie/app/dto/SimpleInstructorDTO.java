package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
// @AllArgsConstructor // Lombok's @AllArgsConstructor would create one with all fields: Long, String, BigDecimal
public class SimpleInstructorDTO {
    private Long instructorId;
    private String fullName;
    private BigDecimal instructorRating; // This is BigDecimal

    // Explicit AllArgsConstructor to match the fields
    public SimpleInstructorDTO(Long instructorId, String fullName, BigDecimal instructorRating) {
        this.instructorId = instructorId;
        this.fullName = fullName;
        this.instructorRating = instructorRating;
    }
    // Getters and setters are provided by @Data

    // Explicit getters and setters if you prefer (Lombok @Data also provides them)
    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public BigDecimal getInstructorRating() { return instructorRating; }
    public void setInstructorRating(BigDecimal instructorRating) { this.instructorRating = instructorRating; }
}