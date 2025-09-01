package com.taskmanager.exception;

import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Test
    void testHandleMethodArgumentNotValidException() {
        // Given
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        WebRequest request = mock(WebRequest.class);
        
        FieldError fieldError = new FieldError("task", "title", "Title is required");
        when(ex.getBindingResult().getAllErrors()).thenReturn(Collections.singletonList(fieldError));
        when(request.getDescription(anyBoolean())).thenReturn("uri=/api/tasks");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleValidationExceptions(ex, request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Validation Failed", response.getBody().getError());
        assertFalse(response.getBody().getFieldErrors().isEmpty());
    }

    @Test
    void testHandleConstraintViolationException() {
        // Given
        ConstraintViolationException ex = mock(ConstraintViolationException.class);
        WebRequest request = mock(WebRequest.class);
        
        when(request.getDescription(anyBoolean())).thenReturn("uri=/api/tasks");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleConstraintViolationException(ex, request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Constraint Violation", response.getBody().getError());
    }

    @Test
    void testHandleResourceNotFoundException() {
        // Given
        ResourceNotFoundException ex = new ResourceNotFoundException("Task not found");
        WebRequest request = mock(WebRequest.class);
        
        when(request.getDescription(anyBoolean())).thenReturn("uri=/api/tasks/123");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleResourceNotFoundException(ex, request);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Resource Not Found", response.getBody().getError());
        assertEquals("Task not found", response.getBody().getMessage());
    }

    @Test
    void testHandleIllegalArgumentException() {
        // Given
        IllegalArgumentException ex = new IllegalArgumentException("Invalid argument");
        WebRequest request = mock(WebRequest.class);
        
        when(request.getDescription(anyBoolean())).thenReturn("uri=/api/tasks");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleIllegalArgumentException(ex, request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid Argument", response.getBody().getError());
        assertEquals("Invalid argument", response.getBody().getMessage());
    }

    @Test
    void testHandleGlobalException() {
        // Given
        Exception ex = new Exception("Unexpected error");
        WebRequest request = mock(WebRequest.class);
        
        when(request.getDescription(anyBoolean())).thenReturn("uri=/api/tasks");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleGlobalException(ex, request);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Internal Server Error", response.getBody().getError());
        assertEquals("Unexpected error", response.getBody().getMessage());
    }
}