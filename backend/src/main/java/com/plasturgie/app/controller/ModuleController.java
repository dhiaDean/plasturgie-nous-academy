package com.plasturgie.app.controller;

import com.plasturgie.app.dto.ModuleRequestDTO;
import com.plasturgie.app.dto.ModuleResponseDTO;
import com.plasturgie.app.exception.ResourceNotFoundException; // Assuming you have this
import com.plasturgie.app.model.Module;
import com.plasturgie.app.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Objects; // For null checks

@RestController
@RequestMapping("/api/courses/{courseId}/modules") // Base path for modules nested under a course
public class ModuleController {
    private static final Logger logger = LoggerFactory.getLogger(ModuleController.class);


    private final ModuleService moduleService;

    @Autowired
    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    /**
     * Creates a new module for a specific course.
     * The courseId from the path is the source of truth for the parent course.
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createModule(
            @PathVariable Long courseId,
            @Valid @RequestPart("moduleData") ModuleRequestDTO moduleRequestDTO,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile,
            @RequestPart(value = "videoFile", required = false) MultipartFile videoFile) throws IOException {

        // Validate that the courseId in the DTO (if present and used by service) matches the path variable
        // It's generally better for the service to take courseId explicitly for creation under a parent.
        // If your ModuleService.createModule implicitly uses moduleRequestDTO.getCourseId(), ensure it's set correctly.
        if (moduleRequestDTO.getCourseId() == null) {
            moduleRequestDTO.setCourseId(courseId); // Set it if not present, assuming service needs it
        } else if (!Objects.equals(moduleRequestDTO.getCourseId(), courseId)) {
            // Or, if your DTO is designed to have it, then it MUST match the path
             return ResponseEntity.badRequest().body("Course ID in request body must match path variable or be absent.");
        }

        ModuleResponseDTO createdModule = moduleService.createModule(moduleRequestDTO, pdfFile, videoFile);
        return new ResponseEntity<>(createdModule, HttpStatus.CREATED);
    }

    /**
     * Retrieves all modules for a specific course.
     */
    @GetMapping
    public ResponseEntity<List<ModuleResponseDTO>> getModulesByCourseId(@PathVariable Long courseId) {
        // The service method already filters by courseId, so this is straightforward.
        List<ModuleResponseDTO> modules = moduleService.getModulesByCourseId(courseId);
        return ResponseEntity.ok(modules);
    }

    /**
     * Retrieves a specific module by its ID, ensuring it belongs to the specified course.
     */
    @GetMapping("/{moduleId}")
    public ResponseEntity<ModuleResponseDTO> getModuleById(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        ModuleResponseDTO moduleDto = moduleService.getModuleById(moduleId);
        // Best practice: Validate that the fetched module actually belongs to the courseId in the path.
        // This prevents accessing /api/courses/1/modules/100 if module 100 belongs to course 2.
        if (moduleDto == null || !Objects.equals(moduleDto.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("Module with id " + moduleId + " not found under course " + courseId);
        }
        return ResponseEntity.ok(moduleDto);
    }

    /**
     * Updates an existing module.
     */
    @PutMapping(value = "/{moduleId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId,
            @Valid @RequestPart("moduleData") ModuleRequestDTO moduleRequestDTO,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile,
            @RequestPart(value = "videoFile", required = false) MultipartFile videoFile) throws IOException {

        // Validate consistency: courseId in DTO must match path or be set from path.
        if (moduleRequestDTO.getCourseId() == null) {
            moduleRequestDTO.setCourseId(courseId);
        } else if (!Objects.equals(moduleRequestDTO.getCourseId(), courseId)) {
            return ResponseEntity.badRequest().body("Course ID in request body must match path variable for update.");
        }
        
        // Additional check: Ensure the module being updated (moduleId) actually belongs to courseId.
        // This might be handled in the service layer or here.
        ModuleResponseDTO existingModule = moduleService.getModuleById(moduleId); // Fetch to verify
        if (existingModule == null || !Objects.equals(existingModule.getCourseId(), courseId)) {
             throw new ResourceNotFoundException("Module with id " + moduleId + " not found under course " + courseId + " for update.");
        }


        ModuleResponseDTO updatedModule = moduleService.updateModule(moduleId, moduleRequestDTO, pdfFile, videoFile);
        return ResponseEntity.ok(updatedModule);
    }

    /**
     * Deletes a module.
     */
    @DeleteMapping("/{moduleId}")
    public ResponseEntity<Void> deleteModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        // Best practice: Validate that the module being deleted belongs to the courseId in the path.
        ModuleResponseDTO moduleDto = moduleService.getModuleById(moduleId); // Fetch to verify
        if (moduleDto == null || !Objects.equals(moduleDto.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("Module with id " + moduleId + " not found under course " + courseId + " for deletion.");
        }
        moduleService.deleteModule(moduleId);
        return ResponseEntity.noContent().build();
    }

    // --- PDF Endpoints ---
// In ModuleController.java

    @GetMapping("/{moduleId}/pdf")
    public ResponseEntity<Resource> downloadPdf(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        // Validate module belongs to course
        ModuleResponseDTO moduleInfo = moduleService.getModuleById(moduleId);
        if (moduleInfo == null || !Objects.equals(moduleInfo.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("PDF for module " + moduleId + " not found under course " + courseId);
        }

        Module module = moduleService.getModuleWithPdf(moduleId);
        if (module.getPdfData() == null || module.getPdfData().length == 0) {
            logger.warn("PDF data not found for module ID: {}", moduleId); // Added logger
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource resource = new ByteArrayResource(module.getPdfData());
        String contentType = module.getPdfContentType() != null ? module.getPdfContentType() : "application/pdf"; // Default to application/pdf
        String filename = module.getPdfFilename() != null ? module.getPdfFilename() : "module.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                // MODIFIED FOR INLINE DISPLAY:
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentLength(module.getPdfData().length) // Good to add content length
                .body(resource);
    } 
    
    @DeleteMapping("/{moduleId}/pdf")
    public ResponseEntity<Void> deleteModulePdf(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        // Validate module belongs to course
        ModuleResponseDTO moduleInfo = moduleService.getModuleById(moduleId);
        if (moduleInfo == null || !Objects.equals(moduleInfo.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("PDF for module " + moduleId + " not found under course " + courseId);
        }
        moduleService.deletePdfFromModule(moduleId);
        return ResponseEntity.noContent().build();
    }

    // --- Video Endpoints ---

    @GetMapping("/{moduleId}/video")
    public ResponseEntity<Resource> downloadVideo(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        // Validate module belongs to course
        ModuleResponseDTO moduleInfo = moduleService.getModuleById(moduleId);
        if (moduleInfo == null || !Objects.equals(moduleInfo.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("Video for module " + moduleId + " not found under course " + courseId);
        }

        Module module = moduleService.getModuleWithVideo(moduleId); // Fetches the entity with byte data
        if (module.getVideoData() == null || module.getVideoData().length == 0) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource resource = new ByteArrayResource(module.getVideoData());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(module.getVideoContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + module.getVideoFilename() + "\"")
                .contentLength(module.getVideoData().length)
                .body(resource);
    }

    @DeleteMapping("/{moduleId}/video")
    public ResponseEntity<Void> deleteModuleVideo(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        // Validate module belongs to course
        ModuleResponseDTO moduleInfo = moduleService.getModuleById(moduleId);
        if (moduleInfo == null || !Objects.equals(moduleInfo.getCourseId(), courseId)) {
            throw new ResourceNotFoundException("Video for module " + moduleId + " not found under course " + courseId);
        }
        moduleService.deleteVideoFromModule(moduleId);
        return ResponseEntity.noContent().build();
    }
}