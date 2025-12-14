package com.plasturgie.app.exception;

import com.fasterxml.jackson.databind.ObjectMapper; // ObjectMapper is still useful for the body
import org.slf4j.Logger; // SLF4J Logger for better logging
import org.slf4j.LoggerFactory; // SLF4J Logger
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest; // For getting request URI
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

// No direct import needed for HttpServletResponse in the modified methods
import java.util.HashMap;
import java.util.Map;
// No direct import needed for IOException in the modified methods

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class); // SLF4J Logger

    // MODIFIED: Returns ResponseEntity<Object>
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllUncaughtException(Exception ex, WebRequest request) {
        log.error("Unhandled exception occurred: " + ex.getMessage(), ex); // Log with stack trace

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred. Please contact support."); // Generic message for users
        // For development, you might want to include ex.getMessage(), but be cautious in production
        // body.put("detailedMessage", ex.getMessage()); 
        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());
        }
        
        // If the response is already committed, Spring might not be able to send this body,
        // but it will try to set the status code if possible.
        // This is inherently safer than directly using response.getWriter().
        return new ResponseEntity<>(body, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(
            HttpMediaTypeNotAcceptableException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        log.warn("Media type not acceptable: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", "Not Acceptable");
        body.put("message", "Requested media type is not supported. Please ensure 'Accept' header is 'application/json'.");
        
        return new ResponseEntity<>(body, headers, status);
    }

    // MODIFIED: Returns ResponseEntity<Object>
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        log.warn("Bad credentials attempt: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Unauthorized");
        body.put("message", "Invalid username or password");
        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());
        }
        
        return new ResponseEntity<>(body, new HttpHeaders(), HttpStatus.UNAUTHORIZED);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        log.warn("Method argument validation failed: {}", ex.getMessage());
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            fieldErrors.put(fieldName, message);
        });
        
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", status.value());
        body.put("error", "Validation Error");
        body.put("message", "Input validation failed");
        body.put("errors", fieldErrors);
        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());
        }
        
        return new ResponseEntity<>(body, headers, status);
    }

    // You can add more specific exception handlers here.
    // For example, for your custom ResourceNotFoundException:
    /*
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());
        }
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
    */
    
    // Handler for the specific IllegalStateException if you want to be very explicit,
    // though the general Exception handler above would also catch it.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
        log.error("Illegal state occurred: " + ex.getMessage(), ex);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Illegal State");
        body.put("message", "An internal error occurred due to an illegal state. Please try again later.");
        if (ex.getMessage() != null && ex.getMessage().contains("getOutputStream() has already been called")) {
            body.put("detail", "Error processing response: Output stream conflict.");
            log.warn("Attempted to write error response after output stream was already in use. The original error might have occurred during binary data streaming.");
            // In this specific case, the client might receive an incomplete or broken response from the original attempt.
            // This error response might not even reach the client if the connection is already compromised.
        } else {
            // body.put("detailedMessage", ex.getMessage()); // For development
        }
        if (request instanceof ServletWebRequest) {
            body.put("path", ((ServletWebRequest)request).getRequest().getRequestURI());
        }

        return new ResponseEntity<>(body, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}