package com.plasturgie.app.service;

import com.plasturgie.app.dto.ModuleRequestDTO;
import com.plasturgie.app.dto.ModuleResponseDTO;
import com.plasturgie.app.model.Module;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ModuleService {
    ModuleResponseDTO createModule(ModuleRequestDTO moduleRequestDTO, 
                                   MultipartFile pdfFile, 
                                   MultipartFile videoFile) throws IOException; // Added videoFile

    ModuleResponseDTO getModuleById(Long moduleId);
    List<ModuleResponseDTO> getModulesByCourseId(Long courseId);

    ModuleResponseDTO updateModule(Long moduleId, 
                                   ModuleRequestDTO moduleRequestDTO, 
                                   MultipartFile pdfFile, 
                                   MultipartFile videoFile) throws IOException; // Added videoFile

    void deleteModule(Long moduleId);

    Module getModuleWithPdf(Long moduleId);
    Module getModuleWithVideo(Long moduleId); // New: To fetch module with Video data

    void deletePdfFromModule(Long moduleId);
    void deleteVideoFromModule(Long moduleId); // New: To delete video from module
}