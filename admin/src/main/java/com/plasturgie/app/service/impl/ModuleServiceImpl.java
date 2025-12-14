package com.plasturgie.app.service.impl;

import com.plasturgie.app.dto.ModuleRequestDTO;
import com.plasturgie.app.dto.ModuleResponseDTO;
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.Module;
import com.plasturgie.app.repository.CourseRepository;
import com.plasturgie.app.repository.ModuleRepository;
import com.plasturgie.app.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public ModuleServiceImpl(ModuleRepository moduleRepository, CourseRepository courseRepository) {
        this.moduleRepository = moduleRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public ModuleResponseDTO createModule(ModuleRequestDTO requestDTO,
                                          MultipartFile pdfFile,
                                          MultipartFile videoFile) throws IOException {
        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDTO.getCourseId()));

        Module module = new Module();
        module.setTitle(requestDTO.getTitle());
        module.setDescription(requestDTO.getDescription());
        module.setModuleOrder(requestDTO.getModuleOrder());
        module.setCourse(course);
        // module.setVideoUrl(requestDTO.getVideoUrl()); // Removed

        if (pdfFile != null && !pdfFile.isEmpty()) {
            module.setPdfData(pdfFile.getBytes());
            module.setPdfFilename(StringUtils.cleanPath(pdfFile.getOriginalFilename()));
            module.setPdfContentType(pdfFile.getContentType());
        }

        if (videoFile != null && !videoFile.isEmpty()) {
            module.setVideoData(videoFile.getBytes());
            module.setVideoFilename(StringUtils.cleanPath(videoFile.getOriginalFilename()));
            module.setVideoContentType(videoFile.getContentType());
        }

        Module savedModule = moduleRepository.save(module);
        return mapToResponseDTO(savedModule);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleResponseDTO getModuleById(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
        return mapToResponseDTO(module);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModuleResponseDTO> getModulesByCourseId(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        List<Module> modules = moduleRepository.findByCourseCourseIdOrderByModuleOrderAsc(courseId);
        return modules.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ModuleResponseDTO updateModule(Long moduleId, ModuleRequestDTO requestDTO,
                                          MultipartFile pdfFile, MultipartFile videoFile) throws IOException {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDTO.getCourseId()));

        module.setTitle(requestDTO.getTitle());
        module.setDescription(requestDTO.getDescription());
        module.setModuleOrder(requestDTO.getModuleOrder());
        module.setCourse(course);
        // module.setVideoUrl(requestDTO.getVideoUrl()); // Removed

        if (pdfFile != null && !pdfFile.isEmpty()) {
            module.setPdfData(pdfFile.getBytes());
            module.setPdfFilename(StringUtils.cleanPath(pdfFile.getOriginalFilename()));
            module.setPdfContentType(pdfFile.getContentType());
        } // Consider logic if pdfFile is null but user wants to remove existing PDF (add a flag or separate endpoint)

        if (videoFile != null && !videoFile.isEmpty()) {
            module.setVideoData(videoFile.getBytes());
            module.setVideoFilename(StringUtils.cleanPath(videoFile.getOriginalFilename()));
            module.setVideoContentType(videoFile.getContentType());
        } // Same consideration for video removal

        Module updatedModule = moduleRepository.save(module);
        return mapToResponseDTO(updatedModule);
    }

    @Override
    @Transactional
    public void deleteModule(Long moduleId) {
        if (!moduleRepository.existsById(moduleId)) {
            throw new ResourceNotFoundException("Module not found with id: " + moduleId);
        }
        moduleRepository.deleteById(moduleId);
    }

    @Override
    @Transactional(readOnly = true)
    public Module getModuleWithPdf(Long moduleId) {
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
    }

    @Override
    @Transactional(readOnly = true)
    public Module getModuleWithVideo(Long moduleId) {
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
    }

    @Override
    @Transactional
    public void deletePdfFromModule(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
        
        module.setPdfData(null);
        module.setPdfFilename(null);
        module.setPdfContentType(null);
        moduleRepository.save(module);
    }

    @Override
    @Transactional
    public void deleteVideoFromModule(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
        
        module.setVideoData(null);
        module.setVideoFilename(null);
        module.setVideoContentType(null);
        moduleRepository.save(module);
    }

    private ModuleResponseDTO mapToResponseDTO(Module module) {
        ModuleResponseDTO dto = new ModuleResponseDTO();
        dto.setModuleId(module.getModuleId());
        dto.setTitle(module.getTitle());
        dto.setDescription(module.getDescription());
        dto.setModuleOrder(module.getModuleOrder());
        if (module.getCourse() != null) {
            dto.setCourseId(module.getCourse().getCourseId());
            dto.setCourseTitle(module.getCourse().getTitle());
        }
        // dto.setVideoUrl(module.getVideoUrl()); // Removed

        dto.setPdfFilename(module.getPdfFilename());
        dto.setHasPdf(module.getPdfData() != null && module.getPdfData().length > 0);

        dto.setVideoFilename(module.getVideoFilename());
        dto.setHasVideo(module.getVideoData() != null && module.getVideoData().length > 0);
        return dto;
    }
}