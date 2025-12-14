package com.plasturgie.app.controller;

import com.plasturgie.app.dto.AuthRequest;
import com.plasturgie.app.dto.AuthResponse;
import com.plasturgie.app.dto.UserDTO;
import com.plasturgie.app.model.User;
import com.plasturgie.app.security.JwtTokenProvider;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private Environment environment;

    @Value("${spring.application.name}")
    private String applicationName;

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            User user = userService.findByUsername(loginRequest.getUsername());

            AuthResponse response = new AuthResponse(
                jwt,
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
            );

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication failed");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("Content-Type", "application/json")
                    .body(errorResponse);
        }
    }

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            User newUser = userService.registerUser(userDTO);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Registration failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Content-Type", "application/json")
                    .body(errorResponse);
        }
    }

    @GetMapping(value = "/health", produces = "application/json")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", applicationName);
        response.put("activeProfiles", Arrays.toString(environment.getActiveProfiles()));
        response.put("timestamp", System.currentTimeMillis());
        response.put("database", "Connected");
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(response);
    }
}