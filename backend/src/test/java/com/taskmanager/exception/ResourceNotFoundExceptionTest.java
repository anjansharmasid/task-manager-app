package com.taskmanager.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ResourceNotFoundExceptionTest {

    @Test
    void testConstructorWithMessage() {
        // Given
        String message = "Task not found";

        // When
        ResourceNotFoundException exception = new ResourceNotFoundException(message);

        // Then
        assertEquals(message, exception.getMessage());
    }

    @Test
    void testConstructorWithResourceDetails() {
        // Given
        String resourceName = "Task";
        String fieldName = "id";
        Object fieldValue = "123";

        // When
        ResourceNotFoundException exception = new ResourceNotFoundException(resourceName, fieldName, fieldValue);

        // Then
        String expectedMessage = "Task not found with id: '123'";
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void testExceptionInheritance() {
        // Given
        ResourceNotFoundException exception = new ResourceNotFoundException("Test message");

        // Then
        assertTrue(exception instanceof RuntimeException, "Should be a RuntimeException");
    }
}