package com.plasturgie.app.controller;

import com.plasturgie.app.model.ImageUser;
import com.plasturgie.app.model.User; // Import User model
import com.plasturgie.app.service.ImageUserService;
import com.plasturgie.app.service.UserService; // Import UserService
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional; // Keep this import

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/image-users") // Base path for image-related operations
public class ImageUserController {

    private static final Logger log = LoggerFactory.getLogger(ImageUserController.class);

    @Autowired
    private ImageUserService imageUserService;

    @Autowired
    private UserService userService; // Service to fetch User entities

    @GetMapping
    public List<ImageUser> getAllImageUsers() {
        log.info("GET /api/image-users - retrieving all image users metadata (inefficient)");
        // Assumes ImageUser has manual methods needed for serialization
        return imageUserService.getAllImageUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageUser> getImageUserById(@PathVariable Long id) {
        log.info("GET /api/image-users/{} - retrieving image user by id", id);
        // Assumes imageUserService.getImageUserById *DOES* return Optional<ImageUser>
        return imageUserService.getImageUserById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> {
                    log.warn("ImageUser not found with id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "ImageUser not found with id: " + id);
                });
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImageData(@PathVariable Long id) {
        log.info("GET /api/image-users/{}/image - retrieving raw image data", id);
        // Assumes imageUserService.getImageUserById *DOES* return Optional<ImageUser>
        return imageUserService.getImageUserById(id)
                .map(imageUser -> {
                    // Assumes ImageUser has manual getContentType() and getFilename() methods
                    log.debug("Found image for id: {}, content type: {}", id, imageUser.getContentType());
                    HttpHeaders headers = new HttpHeaders();
                    MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM; // Default
                    if (imageUser.getContentType() != null) {
                        try {
                            mediaType = MediaType.parseMediaType(imageUser.getContentType());
                        } catch (Exception e) {
                            log.warn("Invalid content type '{}' stored for image id: {}. Defaulting to octet-stream.", imageUser.getContentType(), id, e);
                        }
                    }
                    headers.setContentType(mediaType);
                    // Optional: Add Content-Disposition for download prompting
                    // headers.setContentDispositionFormData("inline", imageUser.getFilename()); // or "attachment"

                    // Assumes ImageUser has manual getImageData() method
                    return new ResponseEntity<>(imageUser.getImageData(), headers, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.warn("Image data not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Image data not found for id: " + id);
                });
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createImageUser(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        log.info("POST /api/image-users - uploading image for user id: {}", userId);

        if (file.isEmpty()) {
            log.warn("Upload attempt with empty file for user id: {}", userId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File cannot be empty");
        }
        if (userId == null) {
            log.warn("Upload attempt without userId");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID must be provided");
        }

        // --- FIX APPLIED HERE ---
        // Fetch the associated user - Assuming userService.findById returns User or null
        User user = userService.findById(userId);

        // Explicitly check for null because findById doesn't return Optional<User>
        if (user == null) {
            log.warn("User not found with id: {} during image upload", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId);
        }
        // --- END OF FIX ---

        // If we reach here, 'user' is guaranteed not null
        try {
            // Assumes ImageUser has a manual no-argument constructor
            ImageUser imageUser = new ImageUser();
            // Assumes ImageUser has manual setters
            imageUser.setFilename(file.getOriginalFilename());
            imageUser.setContentType(file.getContentType());
            imageUser.setImageData(file.getBytes());
            imageUser.setUser(user); // Use the retrieved, non-null user
            // Timestamps should be handled by JPA Auditing if configured (@CreationTimestamp, @UpdateTimestamp)

            ImageUser savedImageUser = imageUserService.saveImageUser(imageUser);

            // Assumes ImageUser has manual getId() method
            log.info("Successfully saved image with id: {} for user id: {}", savedImageUser.getId(), userId);

            // Assumes ImageUser has manual getId() method
            URI location = URI.create(String.format("/api/image-users/%d", savedImageUser.getId()));

            return ResponseEntity.created(location).build();

        } catch (IOException e) {
            log.error("Failed to read image file bytes for user id: {}", userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process image file", e);
        } catch (IllegalArgumentException e) { // Catch specific exceptions if service layer throws them
            log.error("Invalid data for image user: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        // Consider adding a catch for broader exceptions or a default return if necessary,
        // although ResponseStatusException generally covers many error scenarios.
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImageUser(@PathVariable Long id) {
        log.info("DELETE /api/image-users/{} - deleting image user", id);
        // Assumes imageUserService.getImageUserById *DOES* return Optional<ImageUser>
        if (!imageUserService.getImageUserById(id).isPresent()) {
            log.warn("Attempted to delete non-existent ImageUser with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ImageUser not found with id: " + id);
        }
        try {
            imageUserService.deleteImageUser(id);
            log.info("Successfully deleted image user with id: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) { // Catch more specific exceptions if possible (e.g., DataAccessException)
            log.error("Error deleting image user with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting image user", e);
        }
    }

    @GetMapping("/user/{userId}")
    public List<ImageUser> getImageUsersByUserId(@PathVariable Long userId) {
        log.info("GET /api/image-users/user/{} - retrieving images for user", userId);
        // Assumes ImageUser has manual methods needed for serialization
        return imageUserService.getImageUsersByUserId(userId);
    }
}