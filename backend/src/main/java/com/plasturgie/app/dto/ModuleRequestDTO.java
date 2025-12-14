package com.plasturgie.app.dto;

import lombok.Data;
// import org.springframework.web.multipart.MultipartFile; // Not needed directly in DTO
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class ModuleRequestDTO {
    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String description;

    private Integer moduleOrder;

    @NotNull(message = "Course ID cannot be null")
    private Long courseId;

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

	public Integer getModuleOrder() {
		return moduleOrder;
	}

	public void setModuleOrder(Integer moduleOrder) {
		this.moduleOrder = moduleOrder;
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

    // videoUrl is removed. Video will be handled as a MultipartFile in the controller.
}