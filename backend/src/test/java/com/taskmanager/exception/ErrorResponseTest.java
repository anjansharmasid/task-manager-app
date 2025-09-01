package com.taskmanager.exception;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class ErrorResponseTest {

    @Test
    void testErrorResponseCreation() {
        // Given
        LocalDateTime timestamp = LocalDateTime.now();
        int status = 400;
        String error = "Bad Request";
        String message = "Validation failed";
        String path = "/api/tasks";

        // When
        ErrorResponse errorResponse = new ErrorResponse(timestamp, status, error, message, path);

        // Then
        assertEquals(timestamp, errorResponse.getTimestamp());
        assertEquals(status, errorResponse.getStatus());
        assertEquals(error, errorResponse.getError());
        assertEquals(message, errorResponse.getMessage());
        assertEquals(path, errorResponse.getPath());
        assertNull(errorResponse.getFieldErrors());
    }

    @Test
    void testErrorResponseWithFieldErrors() {
        // Given
        LocalDateTime timestamp = LocalDateTime.now();
        ErrorResponse.FieldError fieldError = new ErrorResponse.FieldError("title", "Title is required", null);

        // When
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(timestamp);
        errorResponse.setStatus(400);
        errorResponse.setError("Bad Request");
        errorResponse.setMessage("Validation failed");
        errorResponse.setPath("/api/tasks");
        errorResponse.setFieldErrors(Collections.singletonList(fieldError));

        // Then
        assertNotNull(errorResponse.getFieldErrors());
        assertEquals(1, errorResponse.getFieldErrors().size());
        assertEquals("title", errorResponse.getFieldErrors().get(0).getField());
    }

    @Test
    void testFieldErrorCreation() {
        // Given
        String field = "title";
        String message = "Title is required";
        Object rejectedValue = "";

        // When
        ErrorResponse.FieldError fieldError = new ErrorResponse.FieldError(field, message, rejectedValue);

        // Then
        assertEquals(field, fieldError.getField());
        assertEquals(message, fieldError.getMessage());
        assertEquals(rejectedValue, fieldError.getRejectedValue());
    }

    @Test
    void testFieldErrorSetters() {
        // Given
        ErrorResponse.FieldError fieldError = new ErrorResponse.FieldError();

        // When
        fieldError.setField("description");
        fieldError.setMessage("Description too long");
        fieldError.setRejectedValue("a".repeat(1001));

        // Then
        assertEquals("description", fieldError.getField());
        assertEquals("Description too long", fieldError.getMessage());
        assertEquals(1001, ((String) fieldError.getRejectedValue()).length());
    }
}