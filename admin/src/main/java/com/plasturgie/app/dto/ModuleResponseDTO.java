package com.plasturgie.app.dto;

import lombok.Data;

@Data
public class ModuleResponseDTO {
    private Long moduleId;
    private String title;
    private String description;
    private Integer moduleOrder;
    private Long courseId;
    private String courseTitle;

    private String pdfFilename;
    private boolean hasPdf;

    private String videoFilename; // To indicate if a video exists and its name
    private boolean hasVideo;     // A flag to easily check if video is available
    // We don't send videoData in the response list.
    // It's fetched via a separate download endpoint.
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
	public String getPdfFilename() {
		return pdfFilename;
	}
	public void setPdfFilename(String pdfFilename) {
		this.pdfFilename = pdfFilename;
	}
	public boolean isHasPdf() {
		return hasPdf;
	}
	public void setHasPdf(boolean hasPdf) {
		this.hasPdf = hasPdf;
	}
	public String getVideoFilename() {
		return videoFilename;
	}
	public void setVideoFilename(String videoFilename) {
		this.videoFilename = videoFilename;
	}
	public boolean isHasVideo() {
		return hasVideo;
	}
	public void setHasVideo(boolean hasVideo) {
		this.hasVideo = hasVideo;
	}
}