package com.plasturgie.app.service;

import com.plasturgie.app.dto.UserListDTO;
import com.plasturgie.app.dto.UserDTO;
import com.plasturgie.app.model.User;
// import com.plasturgie.app.dto.ChangePasswordRequestDTO; // Not directly used in this interface's signature now
import com.plasturgie.app.model.enums.Role;

import java.util.List;
import java.util.Optional; // Keep if you have findOptionalBy... methods

public interface UserService {

    List<UserListDTO> getAllUsersForList(); // This DTO method is good

    // Methods returning User entity (as per your controller)
    User registerUser(UserDTO userDTO);
    User findById(Long id);
    User findByUsername(String username); // As in your previous interface
    
    @Deprecated
    List<User> findAllUsers(); 

    // As in your previous interface
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Password Change method - ACCEPTS STRINGS
    void changePassword(Long userId, String oldPassword, String newPassword); // <<< SIGNATURE MATCHES CONTROLLER CALL

    // Optional methods if you need them internally (not strictly for this fix)
    // Optional<User> findOptionalByUsername(String username); 
    // Optional<User> findOptionalByEmail(String email);
    User updateUser(Long id, UserDTO userDTO);

    // New method for updating role
    void updateUserRole(Long userId, Role newRole); // Or (Long userId, String newRole) if role is a String

    void deleteUser(Long id);
}