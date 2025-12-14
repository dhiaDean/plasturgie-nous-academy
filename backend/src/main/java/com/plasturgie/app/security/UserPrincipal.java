package com.plasturgie.app.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.plasturgie.app.model.User; // Assuming your User model is in this package
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserPrincipal implements UserDetails {
    private Long id; // Field storing the user's ID
    private String username;
    private String email;

    @JsonIgnore
    private String password; // This should ideally be the hashed password from User.passwordHash

    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String username, String email, String password,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        // Ensure user.getRole() is not null if Role enum is non-nullable in User entity
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name()) // Fixed: Use .name() for Enum
        );

        return new UserPrincipal(
                user.getUserId(),      // Source from User.userId
                user.getUsername(),
                user.getEmail(),
                user.getPasswordHash(),// Use the hashed password from User entity
                authorities
        );
    }

    public Long getId() { // Getter for the 'id' field
        return id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password; // Returns the (hashed) password
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o; // Fixed: Cast to UserPrincipal
        return Objects.equals(id, that.id);    // Fixed: Compare 'id' of both UserPrincipal objects
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}