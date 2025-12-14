package com.plasturgie.app.config;

import com.plasturgie.app.security.CustomUserDetailsService;
import com.plasturgie.app.security.JwtAuthenticationFilter;
import com.plasturgie.app.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // *** ADD THIS IMPORT ***
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List; // *** ADD THIS IMPORT if using List.of for origins ***

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService; // Spring automatically uses this for DaoAuthenticationProvider

    @Autowired
    private JwtTokenProvider tokenProvider; // Used by JwtAuthenticationFilter

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        // Assuming JwtAuthenticationFilter constructor takes tokenProvider and userDetailsService
        return new JwtAuthenticationFilter(tokenProvider, userDetailsService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Ensure your frontend origin is listed here.
        // Using List.of() is a more modern way to create lists.
        configuration.setAllowedOrigins(List.of(
                "http://localhost:8080", // Your Vite frontend
                "http://localhost:4200", // Your Angular frontend (if still active)
                "http://localhost:5000",
                "http://192.168.1.101:8080",
                "http://localhost:8081",
                "exp://192.168.233.19:8081",
                "http://192.168.233.19:8081"// Backend itself, good for some tests or tools
                // Add any other origins that need access, like deployed frontend URLs
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // Allows all headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Content-Disposition")); // Expose common headers
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this CORS configuration to all paths
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS using the defined source
                .csrf(csrf -> csrf.disable()) // Disable CSRF as it's common for stateless APIs (using JWT)
                .exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.getWriter().write(
                                "{\"timestamp\":\"" + java.time.LocalDateTime.now() + "\", "+
                                "\"status\":" + HttpStatus.UNAUTHORIZED.value() + ", "+
                                "\"error\":\"Unauthorized\", "+
                                "\"message\":\"" + authException.getMessage() + "\", "+
                                "\"path\":\"" + request.getRequestURI() + "\"}");
                    })
                    // You can also add an AccessDeniedHandler here for 403 errors
                    // .accessDeniedHandler((request, response, accessDeniedException) -> { ... })
                )
                .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions for JWT
                )
                .authorizeHttpRequests(authorize -> authorize // Use authorizeHttpRequests (newer) or authorizeRequests
                    // --- PUBLIC ENDPOINTS (No Authentication Required) ---
                    .antMatchers("/api/auth/**").permitAll()
                    .antMatchers("/public/**").permitAll() // If you have a generic /public path
                    .antMatchers("/actuator/**").permitAll() // If using Spring Boot Actuator and want it public

                    // *** THIS IS THE CRITICAL FIX FOR IMAGES ***
                    .antMatchers(HttpMethod.GET, "/api/courses/{id}/image").permitAll()
                    // You might want other GET requests for courses to be public too:
                    .antMatchers(HttpMethod.GET, "/api/courses").permitAll()       // List all courses
                    .antMatchers(HttpMethod.GET, "/api/courses/{id}").permitAll()  // Get specific course details
                    .antMatchers(HttpMethod.GET, "/api/courses/by-category/**").permitAll()
                    .antMatchers(HttpMethod.GET, "/api/courses/by-mode/**").permitAll()
                    .antMatchers(HttpMethod.GET, "/api/courses/search").permitAll()
                    // Add other GET endpoints you want public (e.g., for instructors list)
                    .antMatchers(HttpMethod.GET, "/api/instructors").permitAll()
                    .antMatchers(HttpMethod.GET, "/api/instructors/{id}").permitAll()


                    // --- PROTECTED ENDPOINTS (Require Authentication) ---
                    // Methods like POST, PUT, DELETE on /api/courses/v2, /api/courses, etc.,
                    // will be protected by .anyRequest().authenticated() if not listed above.
                    // Your @PreAuthorize annotations will then provide finer-grained role-based access control.
                    .anyRequest().authenticated() // All other requests require authentication
                )
                // Add the custom JWT filter before the standard UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}