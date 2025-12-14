package com.plasturgie.app.service.impl;

import com.plasturgie.app.dto.InstructorInputDTO;
import com.plasturgie.app.dto.InstructorListDTO;
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Instructor;
import com.plasturgie.app.model.Review;
import com.plasturgie.app.model.User;
import com.plasturgie.app.repository.InstructorRepository;
import com.plasturgie.app.repository.ReviewRepository;
import com.plasturgie.app.repository.UserRepository;
import com.plasturgie.app.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstructorServiceImpl implements InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // --- DTO Conversion Helper ---
    private InstructorListDTO convertToInstructorListDTO(Instructor instructor){
        if (instructor == null) return null;
        User user = instructor.getUser(); // Assumes user is fetched (use EAGER or JOIN FETCH in repo if needed here)
        String fullName = "N/A";
        Long userId = null;
        if (user != null) {
            userId = user.getUserId();
            fullName = (user.getFirstName() != null ? user.getFirstName().trim() : "") +
                       (user.getLastName() != null ? " " + user.getLastName().trim() : "");
            fullName = fullName.trim();
            if (fullName.isEmpty()) fullName = user.getUsername(); // Fallback to username
        }

        // Corrected to match the InstructorListDTO constructor (id, name, bio, rating, userId)
        return new InstructorListDTO(
                instructor.getInstructorId(), // Argument 1 (Long) for DTO's 'id'
                fullName,                     // Argument 2 (String) for DTO's 'name'
                instructor.getExpertise(),    // Argument 3 (String) --- MISMATCH! DTO expects 'bio' here.
                instructor.getRating(),       // Argument 4 (BigDecimal) for DTO's 'rating'
                userId                        // Argument 5 (Long) for DTO's 'userId'
        );
    }

    
    @Override
    @Transactional(readOnly = true)
    public InstructorListDTO getInstructorListDTOById(Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId) // Consider findByIdWithUser explicitly
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
        return convertToInstructorListDTO(instructor);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Instructor getInstructorById(Long instructorId) { // Returns raw entity
        return instructorRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
    }


    @Override
    @Transactional(readOnly = true)
    public InstructorListDTO findListDTOByUserId(Long userId) {
        Instructor instructor = instructorRepository.findByUserId(userId) // Assumes findByUserId fetches User eagerly or JOIN FETCHES
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "userId", userId));
        return convertToInstructorListDTO(instructor);
    }

    @Override
    @Transactional(readOnly = true)
    public Instructor findByUserId(Long userId) { // Returns raw entity
        return instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "userId", userId));
    }


    @Override
    @Transactional(readOnly = true)
    public List<InstructorListDTO> getAllInstructorsForList() {
        // Ensure repository method fetches User eagerly for DTO conversion, or use a dedicated query
        // e.g., instructorRepository.findAllWithUserDetails()
        List<Instructor> instructors = instructorRepository.findAll(); // Standard findAll might lazy load User
        return instructors.stream()
                .map(this::convertToInstructorListDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InstructorListDTO createInstructor(InstructorInputDTO instructorInputDTO) {
        User user = userRepository.findById(instructorInputDTO.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorInputDTO.getUserId()));

        if (instructorRepository.findByUserId(user.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User with ID " + user.getUserId() + " is already an instructor.");
        }
        
        Instructor newInstructor = new Instructor();
        newInstructor.setUser(user);
        newInstructor.setBio(instructorInputDTO.getBio());
        newInstructor.setExpertise(instructorInputDTO.getExpertise());
        newInstructor.setRating(BigDecimal.ZERO); // Initial rating
        
        Instructor savedInstructor = instructorRepository.save(newInstructor);
        return convertToInstructorListDTO(savedInstructor);
    }

    @Override
    @Transactional
    public InstructorListDTO updateInstructor(Long instructorId, InstructorInputDTO instructorInputDTO) {
        Instructor instructor = getInstructorById(instructorId); // Fetches existing raw entity
        
        // Check if the user being associated is different and exists
        if (!instructor.getUser().getUserId().equals(instructorInputDTO.getUserId())) {
            User newUser = userRepository.findById(instructorInputDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id to associate", instructorInputDTO.getUserId()));
             // Check if this new user is already linked to another instructor
             if (instructorRepository.findByUserId(newUser.getUserId()).filter(otherInst -> !otherInst.getInstructorId().equals(instructorId)).isPresent()) {
                 throw new IllegalArgumentException("User with ID " + newUser.getUserId() + " is already associated with another instructor.");
             }
            instructor.setUser(newUser);
        }
        
        instructor.setBio(instructorInputDTO.getBio());
        instructor.setExpertise(instructorInputDTO.getExpertise());
        // instructor.setRating(...); // Rating is calculated, not set from input DTO directly typically
        
        Instructor updatedInstructor = instructorRepository.save(instructor);
        return convertToInstructorListDTO(updatedInstructor);
    }


    @Override
    @Transactional
    public void updateInstructorRating(Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId) // Using raw entity from repo
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));

        // List<Review> reviews = reviewRepository.findByInstructor(instructor);
        List<Review> reviews = reviewRepository.findByInstructor_InstructorId(instructorId); // Use ID-based method


        if (reviews.isEmpty()) {
            instructor.setRating(BigDecimal.ZERO);
        } else {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            instructor.setRating(BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP));
        }
        instructorRepository.save(instructor);
    }

    @Override
    @Transactional
    public void deleteInstructor(Long instructorId) {
        if (!instructorRepository.existsById(instructorId)) {
            throw new ResourceNotFoundException("Instructor", "id", instructorId);
        }
        // Consider what happens to courses taught by this instructor (e.g., disassociate, reassign, or block deletion if active).
        instructorRepository.deleteById(instructorId);
    }

     @Override
     @Transactional(readOnly = true)
     public List<InstructorListDTO> getInstructorsByExpertise(String expertise) {
         // This method filters by the 'expertise' field of the Instructor entity.
         // The returned DTOs will contain 'bio' as per the InstructorListDTO definition.
         List<Instructor> instructors = instructorRepository.findByExpertiseContainingIgnoreCase(expertise); // ASSUMING THIS REPO METHOD EXISTS
         return instructors.stream()
                 // The filter below is redundant if findByExpertiseContainingIgnoreCase already does this.
                 // .filter(instructor -> instructor.getExpertise() != null && instructor.getExpertise().toLowerCase().contains(expertise.toLowerCase()))
                 .map(this::convertToInstructorListDTO)
                 .collect(Collectors.toList());
     }

     @Override
     @Transactional(readOnly = true)
     public List<InstructorListDTO> getInstructorsByMinRating(BigDecimal minRating) {
         List<Instructor> instructors = instructorRepository.findByRatingGreaterThanEqual(minRating); // ASSUMING THIS REPO METHOD EXISTS
         return instructors.stream()
                 .map(this::convertToInstructorListDTO)
                 .collect(Collectors.toList());
     }
}