package com.plasturgie.app.controller;

import com.plasturgie.app.dto.UserListDTO;
import com.plasturgie.app.dto.UserRoleUpdateDTO;
import com.plasturgie.app.dto.UserDTO; // Your input DTO
import com.plasturgie.app.dto.ChangePasswordRequestDTO; // For password change request body
import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.User; // Returning User entity from some endpoints
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserListDTO>> getAllUsers() {
        logger.info("Admin request to get all users for list.");
        List<UserListDTO> users = userService.getAllUsersForList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id, #currentUser)")
    public ResponseEntity<User> getUserById( // Kept as ResponseEntity<User>
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String requester = currentUser != null ? currentUser.getUsername() : "anonymous/system";
        logger.info("Request to get user by ID: {} by user {}", id, requester);
        try {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (ResourceNotFoundException e) {
            logger.warn("User not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUserPrincipal) { // Kept as ResponseEntity<User>
         if (currentUserPrincipal == null || currentUserPrincipal.getId() == null) {
            logger.error("/me endpoint called without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
         }
         logger.info("Request for current user profile by: {}", currentUserPrincipal.getUsername());
         try {
            User user = userService.findById(currentUserPrincipal.getId()); 
            return ResponseEntity.ok(user);
        } catch (ResourceNotFoundException e) { 
             logger.error("Authenticated user {} (ID: {}) not found in database during /me request.", 
                          currentUserPrincipal.getUsername(), currentUserPrincipal.getId(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
        }
    }
    
    @PutMapping("/me/password") // Using /me/password for clarity
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changeCurrentUserPassword(
            @Valid @RequestBody ChangePasswordRequestDTO passwordRequest, // DTO for request body
            @AuthenticationPrincipal UserPrincipal currentUserPrincipal) {
        
        if (currentUserPrincipal == null || currentUserPrincipal.getId() == null) {
            logger.warn("Attempt to change password without a valid authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not properly authenticated."));
        }

        logger.info("User {} attempting to change their password.", currentUserPrincipal.getUsername());
        try {
            // *** CALLING SERVICE WITH INDIVIDUAL STRINGS ***
            userService.changePassword(
                    currentUserPrincipal.getId(),
                    passwordRequest.getOldPassword(), 
                    passwordRequest.getNewPassword()
            );
            logger.info("Password changed successfully for user: {}", currentUserPrincipal.getUsername());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed password change for user {}: {}", currentUserPrincipal.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (ResourceNotFoundException e) {
             logger.error("User {} (ID: {}) not found during password change attempt.", 
                         currentUserPrincipal.getUsername(), currentUserPrincipal.getId(), e);
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User account not found."));
        } catch (Exception e) {
            logger.error("Unexpected error during password change for user {}: {}", currentUserPrincipal.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An internal error occurred."));
        }
    }

    // updateUser endpoint as you had it, returning User entity
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id, #currentUser)")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO, // Input DTO
            @AuthenticationPrincipal UserPrincipal currentUser) {
         logger.info("User {} attempting to update user ID: {}", currentUser.getUsername(), id);
         try {
            User updatedUser = userService.updateUser(id, userDTO); // Service returns User entity
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
             logger.warn("Bad request updating user ID {}: {}", id, e.getMessage());
             return ResponseEntity.badRequest().body(null); // Important: returns 400 with null body
        } catch (ResourceNotFoundException e) {
             logger.warn("User ID {} not found for update.", id);
             return ResponseEntity.notFound().build();
        }
    }
    
    
 
    @PutMapping("/{id}/role") 
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateDTO roleUpdateDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        logger.info("Admin {} attempting to update role for user ID: {}", currentUser.getUsername(), id);
        try {
            userService.updateUserRole(id, roleUpdateDTO.getRole()); 
            return ResponseEntity.ok(Map.of("message", "User role updated successfully."));
        } catch (IllegalArgumentException e) {
            logger.warn("Bad request updating role for user ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            logger.warn("User ID {} not found for role update.", id);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        logger.info("Admin request to delete user ID: {}", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            logger.warn("User not found for deletion, ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check/username")
    public ResponseEntity<Boolean> checkUsernameAvailability(@RequestParam String username) {
        boolean isAvailable = !userService.existsByUsername(username);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/check/email")
    public ResponseEntity<Boolean> checkEmailAvailability(@RequestParam String email) {
        boolean isAvailable = !userService.existsByEmail(email);
        return ResponseEntity.ok(isAvailable);
    }
}