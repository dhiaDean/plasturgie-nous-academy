package com.plasturgie.app.service;

import com.plasturgie.app.dto.InstructorInputDTO; // ADDED
import com.plasturgie.app.dto.InstructorListDTO;  // ADDED
import com.plasturgie.app.model.Instructor;
// import com.plasturgie.app.model.User; // No longer needed directly in interface if using userId
import java.math.BigDecimal;
import java.util.List;

public interface InstructorService {
    // Returns DTO
    InstructorListDTO getInstructorListDTOById(Long instructorId);
    InstructorListDTO findListDTOByUserId(Long userId);
    List<InstructorListDTO> getAllInstructorsForList();

    // Still returns entity for internal use or if DTO conversion is complex here
    Instructor getInstructorById(Long instructorId); // For internal service use or if full entity needed by controller
    Instructor findByUserId(Long userId);


    // Accepts DTO for creation
    InstructorListDTO createInstructor(InstructorInputDTO instructorInputDTO);
    // Accepts DTO for update
    InstructorListDTO updateInstructor(Long instructorId, InstructorInputDTO instructorInputDTO);

    void deleteInstructor(Long instructorId);
    void updateInstructorRating(Long instructorId); // Method to recalculate and save rating

    // Methods for searching, could return List<InstructorListDTO>
    List<InstructorListDTO> getInstructorsByExpertise(String expertise);
    List<InstructorListDTO> getInstructorsByMinRating(BigDecimal minRating);
}