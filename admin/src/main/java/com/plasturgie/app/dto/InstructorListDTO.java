package com.plasturgie.app.dto;

import java.math.BigDecimal;
import lombok.Data;
// import lombok.NoArgsConstructor; // Temporarily remove
// import lombok.AllArgsConstructor; // Temporarily remove

@Data
public class InstructorListDTO {
    private Long id;
    private String name;
    private String bio;
    private BigDecimal rating;
    private Long userId;

    // Explicit no-args constructor (if needed by frameworks like Jackson)
    public InstructorListDTO() {}

    // Explicit all-args constructor
    public InstructorListDTO(Long id, String name, String bio, BigDecimal rating, Long userId) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.rating = rating;
        this.userId = userId;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public BigDecimal getRating() {
		return rating;
	}

	public void setRating(BigDecimal rating) {
		this.rating = rating;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}