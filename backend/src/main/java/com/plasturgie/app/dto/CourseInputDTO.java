package com.plasturgie.app.dto;





import com.plasturgie.app.model.enums.Mode; // Ensure this import is correct
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseInputDTO {
    // From frontend CourseInputDTO (api.types.ts)
    // We will assume frontend sends durationHours directly if it's a number.
    // If frontend sends duration string, backend needs to parse it or frontend DTO changes.
    // For simplicity, let's assume frontend form will now handle 'durationHours' as a number.

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    private String category;

    @NotNull(message = "Mode is mandatory")
    private Mode mode;

    private BigDecimal price; // Use BigDecimal for monetary values

    private Boolean certificationEligible;

    private String level;

    private String startDate; // Expected as "YYYY-MM-DD" string from frontend

    private Integer durationHours; // Matched to Course entity's durationHours field

    private String location;

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

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public Integer getDurationHours() {
		return durationHours;
	}

	public void setDurationHours(Integer durationHours) {
		this.durationHours = durationHours;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public List<Long> getInstructorIds() {
		return instructorIds;
	}

	public void setInstructorIds(List<Long> instructorIds) {
		this.instructorIds = instructorIds;
	}

	private List<Long> instructorIds;

    // If you handle modules on creation/update:
    // private List<ModuleInputDTO> modules; // Assuming ModuleInputDTO exists
}