package com.plasturgie.app.dto;

import com.plasturgie.app.model.enums.Role; // Assuming this is your Role enum
import javax.validation.constraints.NotNull;

public class UserRoleUpdateDTO {

    @NotNull(message = "Role cannot be null")
    private Role role; // Use your Role enum type

    // Getter
    public Role getRole() {
        return role;
    }

    // Setter
    public void setRole(Role role) {
        this.role = role;
    }

    // If role is a String in your User entity and you want to validate against specific values:
    // You might use @Pattern or a custom @ValidRole annotation
    // @NotBlank(message = "Role cannot be blank")
    // @Pattern(regexp = "ADMIN|LEARNER|INSTRUCTOR", message = "Invalid role specified") // Example
    // private String role;
    // public String getRole() { return role; }
    // public void setRole(String role) { this.role = role; }
}