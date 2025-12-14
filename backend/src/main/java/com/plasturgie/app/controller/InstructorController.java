package com.plasturgie.app.controller;

import com.plasturgie.app.dto.InstructorInputDTO;
import com.plasturgie.app.dto.InstructorListDTO;
import com.plasturgie.app.exception.ResourceNotFoundException; // Your specific exception
// import com.plasturgie.app.model.Instructor; // Only needed if some methods still return raw entity
// import com.plasturgie.app.model.User; // No longer needed directly here
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.InstructorService;
// import com.plasturgie.app.service.UserService; // UserService is used within InstructorService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/instructors")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InstructorListDTO> createInstructor(
            @Valid @RequestBody InstructorInputDTO instructorInputDTO) { // Use InputDTO
        try {
            InstructorListDTO newInstructorDTO = instructorService.createInstructor(instructorInputDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newInstructorDTO);
        } catch (IllegalArgumentException e) { // e.g., user already an instructor
             return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Or more specific error DTO
        } catch (ResourceNotFoundException e) { // e.g., user for instructor not found
             return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("permitAll()") // Or isAuthenticated() if login required
    public ResponseEntity<List<InstructorListDTO>> getAllInstructors() {
        List<InstructorListDTO> instructorsDTO = instructorService.getAllInstructorsForList();
        return ResponseEntity.ok(instructorsDTO);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<InstructorListDTO> getInstructorById(@PathVariable Long id) {
        try {
            InstructorListDTO instructorDTO = instructorService.getInstructorListDTOById(id);
            return ResponseEntity.ok(instructorDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-user/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<InstructorListDTO> getInstructorByUserId(@PathVariable Long userId) {
        try {
             InstructorListDTO instructorDTO = instructorService.findListDTOByUserId(userId);
             return ResponseEntity.ok(instructorDTO);
        } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-expertise/{expertise}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<InstructorListDTO>> getInstructorsByExpertise(@PathVariable String expertise) {
        List<InstructorListDTO> instructors = instructorService.getInstructorsByExpertise(expertise);
        return ResponseEntity.ok(instructors);
    }

    @GetMapping("/by-min-rating/{minRating}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<InstructorListDTO>> getInstructorsByMinRating(@PathVariable BigDecimal minRating) {
        List<InstructorListDTO> instructors = instructorService.getInstructorsByMinRating(minRating);
        return ResponseEntity.ok(instructors);
    }

     @GetMapping("/me")
     @PreAuthorize("hasRole('INSTRUCTOR')")
     public ResponseEntity<InstructorListDTO> getCurrentInstructorProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
         try {
             InstructorListDTO instructorDTO = instructorService.findListDTOByUserId(currentUser.getId());
             return ResponseEntity.ok(instructorDTO);
         } catch (ResourceNotFoundException e) {
             // This case means user has INSTRUCTOR role but no Instructor entity linked.
             // Could be an internal error or setup issue.
             System.err.println("Error: INSTRUCTOR role user has no corresponding Instructor entity. User ID: " + currentUser.getId());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Or a specific error DTO
         }
     }

     @PutMapping("/{id}")
     @PreAuthorize("hasRole('ADMIN') or @instructorSecurityService.isOwner(#id, principal.userId)") // Example with custom security
     public ResponseEntity<InstructorListDTO> updateInstructor(
             @PathVariable Long id,
             @Valid @RequestBody InstructorInputDTO instructorInputDTO, // Use InputDTO
             @AuthenticationPrincipal UserPrincipal currentUser) { // CurrentUser for security service
         try {
              InstructorListDTO updatedInstructorDTO = instructorService.updateInstructor(id, instructorInputDTO);
              return ResponseEntity.ok(updatedInstructorDTO);
         } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
         } catch (IllegalArgumentException e) { // e.g., new user for instructor already linked elsewhere
             return ResponseEntity.status(HttpStatus.CONFLICT).build();
         }
     }

     @PutMapping("/{id}/update-rating") // This might be better as an internal call after reviews
     @PreAuthorize("hasRole('ADMIN')") // Or could be triggered by review creation/update
     public ResponseEntity<InstructorListDTO> triggerInstructorRatingUpdate(@PathVariable Long id) {
         try {
              instructorService.updateInstructorRating(id); // Service method recalculates
              InstructorListDTO instructorDTO = instructorService.getInstructorListDTOById(id); // Fetch updated DTO
              return ResponseEntity.ok(instructorDTO);
         } catch (ResourceNotFoundException e) {
             return ResponseEntity.notFound().build();
         }
     }

     @DeleteMapping("/{id}")
     @PreAuthorize("hasRole('ADMIN')")
     public ResponseEntity<Void> deleteInstructor(@PathVariable Long id) {
         try {
              instructorService.deleteInstructor(id);
              return ResponseEntity.noContent().build();
         } catch (ResourceNotFoundException e) {
              return ResponseEntity.notFound().build();
         }
     }
}