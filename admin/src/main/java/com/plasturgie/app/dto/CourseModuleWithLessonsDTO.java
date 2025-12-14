package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseModuleWithLessonsDTO {
    private Long moduleId;
    private String title;
    private String description;
    private Integer moduleOrder;
    private List<String> lessons = new ArrayList<>();
	public Long getModuleId() {
		return moduleId;
	}
	public void setModuleId(Long moduleId) {
		this.moduleId = moduleId;
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
	public Integer getModuleOrder() {
		return moduleOrder;
	}
	public void setModuleOrder(Integer moduleOrder) {
		this.moduleOrder = moduleOrder;
	}
	public List<String> getLessons() {
		return lessons;
	}
	public void setLessons(List<String> lessons) {
		this.lessons = lessons;
	}
}