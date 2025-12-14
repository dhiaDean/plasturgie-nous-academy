package com.plasturgie.app.repository;

import com.plasturgie.app.dto.UserListDTO; // ADD IMPORT
import com.plasturgie.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // ADD IMPORT
import org.springframework.stereotype.Repository;

import java.util.List; // ADD IMPORT
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ADD THIS METHOD
    @Query("SELECT new com.plasturgie.app.dto.UserListDTO(" +
           "u.userId, u.username, u.email, u.firstName, u.lastName, u.role, u.createdAt" +
           ") " +
           "FROM User u ORDER BY u.userId ASC")
    List<UserListDTO> findAllAsUserListDTO();
    // END ADDED METHOD

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}