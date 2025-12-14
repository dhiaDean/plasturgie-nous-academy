package com.plasturgie.app.service;

import com.plasturgie.app.model.ImageUser;
import java.util.List;
import java.util.Optional;

public interface ImageUserService {

    /**
     * Retrieves all image metadata records.
     * WARNING: Potentially inefficient if many images exist. Consider pagination or DTOs.
     * @return A list of all ImageUser entities.
     */
    List<ImageUser> getAllImageUsers();

    /**
     * Retrieves a specific ImageUser by its ID. Includes image data (fetched lazily).
     * @param id The ID of the ImageUser.
     * @return An Optional containing the ImageUser if found.
     */
    Optional<ImageUser> getImageUserById(Long id);

    /**
     * Saves a new ImageUser or updates an existing one.
     * Handles setting necessary fields and persisting.
     * @param imageUser The ImageUser entity to save (should have user, imageData, filename, contentType set).
     * @return The saved ImageUser entity, potentially with generated ID and timestamps.
     */
    ImageUser saveImageUser(ImageUser imageUser);

    /**
     * Deletes an ImageUser by its ID.
     * @param id The ID of the ImageUser to delete.
     */
    void deleteImageUser(Long id);

    /**
     * Retrieves all images associated with a specific user.
     * @param userId The ID of the user.
     * @return A list of ImageUser entities for the user.
     */
    List<ImageUser> getImageUsersByUserId(Long userId);

    /**
     * Retrieves the latest uploaded image for a specific user.
     * @param userId The ID of the user.
     * @return An Optional containing the latest ImageUser if found.
     */
    Optional<ImageUser> getLatestImageForUser(Long userId);

}