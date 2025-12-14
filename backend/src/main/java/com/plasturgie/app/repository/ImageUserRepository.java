package com.plasturgie.app.repository;

import com.plasturgie.app.model.ImageUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageUserRepository extends JpaRepository<ImageUser, Long> {

    /**
     * Finds all images associated with a specific user ID.
     * @param userId The ID of the user (corresponds to ImageUser.user.userId).
     * @return A list of ImageUser entities for the given user.
     */
    // --- CORRECTED METHOD NAME ---
    List<ImageUser> findByUser_UserId(Long userId);
    // --- END OF CORRECTION ---


    /**
     * Finds the first image associated with a specific user ID,
     * ordered by the ImageUser's ID descending (typically the latest).
     *
     * @param userId The ID of the associated user (ImageUser.user.userId).
     * @return An Optional containing the ImageUser if found, otherwise empty.
     */
    // --- CORRECTED METHOD NAME ---
    Optional<ImageUser> findFirstByUser_UserIdOrderByIdDesc(Long userId);
    // --- END OF CORRECTION ---

}