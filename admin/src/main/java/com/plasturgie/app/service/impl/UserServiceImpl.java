package com.plasturgie.app.service.impl;

import com.plasturgie.app.dto.UserListDTO;
import com.plasturgie.app.dto.UserDTO;
// import com.plasturgie.app.dto.ChangePasswordRequestDTO; // Not directly used in changePassword method signature now
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.exception.UserAlreadyExistsException;
import com.plasturgie.app.model.User;
import com.plasturgie.app.model.enums.Role;
import com.plasturgie.app.repository.UserRepository;
import com.plasturgie.app.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- Methods from your existing UserServiceImpl (ensure they match the interface) ---
    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
         return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
    
    // Implementing Optional finders if they are in your interface
    // @Override
    // @Transactional(readOnly = true)
    // public Optional<User> findOptionalByUsername(String username) {
    //     return userRepository.findByUsername(username);
    // }

    // @Override
    // @Transactional(readOnly = true)
    // public Optional<User> findOptionalByEmail(String email) {
    //     return userRepository.findByEmail(email);
    // }


    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public User registerUser(UserDTO userDTO) {
        logger.info("Registering user: {}", userDTO.getUsername());
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new UserAlreadyExistsException("Username '" + userDTO.getUsername() + "' is already taken!");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException("Email '" + userDTO.getEmail() + "' is already in use!");
        }
        if (!StringUtils.hasText(userDTO.getPassword())) {
            throw new IllegalArgumentException("Password is required for registration.");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(Role.LEARNER); 
        
        User savedUser = userRepository.save(user);
        logger.info("User {} registered successfully with role {}", savedUser.getUsername(), savedUser.getRole());
        return savedUser;
    }
   
    @Override	
    @Transactional
    public User updateUser(Long id, UserDTO userDTO) {
        User user = findById(id);
        logger.info("Updating user: {}", user.getUsername());

        if (StringUtils.hasText(userDTO.getUsername()) && !user.getUsername().equals(userDTO.getUsername())) {
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                throw new UserAlreadyExistsException("Username '" + userDTO.getUsername() + "' is already taken!");
            }
            user.setUsername(userDTO.getUsername());
        }
        if (StringUtils.hasText(userDTO.getEmail()) && !user.getEmail().equals(userDTO.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new UserAlreadyExistsException("Email '" + userDTO.getEmail() + "' is already in use!");
            }
            user.setEmail(userDTO.getEmail());
        }
        
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        
        // Password and Role should not be updated via this generic method by a non-admin.
        // Admin specific logic should be in adminUpdateUser or similar.

        User updatedUser = userRepository.save(user);
        logger.info("User {} updated successfully.", updatedUser.getUsername());
        return updatedUser;
    }
    @Override
    @Transactional
    public void updateUserRole(Long userId, Role newRole) { // Or (Long userId, String newRoleStr)
        User user = findById(userId); // Leverages existing findById which throws ResourceNotFoundException

        logger.info("Attempting to update role for user: {} (ID: {}) to {}", user.getUsername(), userId, newRole);

        // If newRole is a String and needs to be converted/validated against an Enum:
        // Role roleEnum;
        // try {
        //     roleEnum = Role.valueOf(newRoleStr.toUpperCase());
        // } catch (IllegalArgumentException e) {
        //     logger.warn("Invalid role string provided for user {}: {}", user.getUsername(), newRoleStr);
        //     throw new IllegalArgumentException("Invalid role value: " + newRoleStr);
        // }
        // user.setRole(roleEnum);

        // If newRole is already the correct type (e.g., Role enum directly from DTO)
        user.setRole(newRole);

        userRepository.save(user);
        logger.info("Role updated successfully for user: {} to {}", user.getUsername(), newRole);
    }


    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        logger.info("Deleting user with ID: {}", id);
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserListDTO> getAllUsersForList() {
        return userRepository.findAllAsUserListDTO();
    }

    @Override
    @Deprecated
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        logger.warn("findAllUsers (returning entities) was called. This is deprecated for API use.");
        return userRepository.findAll();
    }

    // --- PASSWORD CHANGE IMPLEMENTATION (Accepting Strings) ---
    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) { // Signature matches controller call
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        logger.debug("Attempting password change for user: {}", user.getUsername());

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            logger.warn("Incorrect old password provided for user: {}", user.getUsername());
            throw new IllegalArgumentException("Incorrect old password provided.");
        }

        if (!StringUtils.hasText(newPassword) || newPassword.length() < 8) {
            logger.warn("New password for user {} does not meet policy (min 8 chars, not empty).", user.getUsername());
            throw new IllegalArgumentException("New password must be at least 8 characters long and not empty.");
        }
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            logger.warn("New password is the same as the old password for user: {}", user.getUsername());
            throw new IllegalArgumentException("New password cannot be the same as the old password.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setJwtToken(null); 
        user.setTokenExpiry(null); 
        
        userRepository.save(user);
        logger.info("Password changed successfully for user: {}", user.getUsername());
    }
}