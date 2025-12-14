package com.plasturgie.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// @AllArgsConstructor // This will now generate the correct constructor
public class SimpleModuleDTO {
    private Long moduleId;
    private String title;
    private Integer order; // Corresponds to moduleOrder in the Module entity

    // Explicit AllArgsConstructor to match the fields
    public SimpleModuleDTO(Long moduleId, String title, Integer order) {
        this.moduleId = moduleId;
        this.title = title;
        this.order = order;
    }

    // Explicit getters and setters if you prefer (Lombok @Data also provides them)
    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
}