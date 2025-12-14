package com.plasturgie.app.service.impl;

import com.plasturgie.app.model.ImageUser;
import com.plasturgie.app.repository.ImageUserRepository;
// Removed: import com.plasturgie.app.service.ImageUserService; // No need to import self-interface in impl
import com.plasturgie.app.service.ImageUserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ImageUserServiceImpl implements ImageUserService { // Implements the interface

    private static final Logger log = LoggerFactory.getLogger(ImageUserServiceImpl.class);

    @Autowired
    private ImageUserRepository imageUserRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ImageUser> getAllImageUsers() {
        log.debug("Fetching all image users");
        return imageUserRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ImageUser> getImageUserById(Long id) {
        log.debug("Fetching image user by id: {}", id);
        return imageUserRepository.findById(id);
    }

    @Override
    @Transactional
    public ImageUser saveImageUser(ImageUser imageUser) {
        // Check if Lombok is working now - this line should compile
        log.debug("Saving image user for user id: {}", imageUser.getUser() != null ? imageUser.getUser().getUserId() : "null");

        // This line should also compile if Lombok is working
        if (imageUser.getUser() == null || imageUser.getImageData() == null || imageUser.getImageData().length == 0) {
            throw new IllegalArgumentException("ImageUser must have associated User and non-empty image data.");
        }
        return imageUserRepository.save(imageUser);
    }

    @Override
    @Transactional
    public void deleteImageUser(Long id) {
        log.debug("Deleting image user by id: {}", id);
        if (!imageUserRepository.existsById(id)) {
             log.warn("Attempted to delete non-existent ImageUser with id: {}", id);
        }
        imageUserRepository.deleteById(id);
    }

    @Override // Ensure @Override is present
    @Transactional(readOnly = true)
    public List<ImageUser> getImageUsersByUserId(Long userId) {
        log.debug("Fetching image users for user id: {}", userId);
        return imageUserRepository.findByUser_UserId(userId);
    }

    @Override // Ensure @Override is present
    @Transactional(readOnly = true)
    public Optional<ImageUser> getLatestImageForUser(Long userId) {
        log.debug("Fetching latest image for user id: {}", userId);
        return imageUserRepository.findFirstByUser_UserIdOrderByIdDesc(userId);
    }}
