package com.taskmanager.model;

import org.junit.jupiter.api.Test;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.LocalDateTime;
import java.util.Set;
import jakarta.validation.ConstraintViolation;

import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    private final Validator validator;

    public TaskTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidTask() {
        Task task = Task.builder()
                .title("Valid Task Title")
                .description("Valid description")
                .status("pending")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertTrue(violations.isEmpty(), "No validation errors should occur for valid task");
    }

    @Test
    void testTitleValidation() {
        Task task = Task.builder()
                .title("") // Empty title - should fail
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Title is required and cannot be empty", violations.iterator().next().getMessage());
    }

    @Test
    void testTitleLengthValidation() {
        Task task = Task.builder()
                .title("ab") // Too short - should fail
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertFalse(violations.isEmpty());
        assertEquals("Title must be between 3 and 100 characters", violations.iterator().next().getMessage());
    }

    @Test
    void testDueDateValidation() {
        Task task = Task.builder()
                .title("Valid Task")
                .dueDate(LocalDateTime.now().minusDays(1)) // Past date - should fail
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertFalse(violations.isEmpty());
        assertEquals("Due date must be in the future", violations.iterator().next().getMessage());
    }

    @Test
    void testStatusValidation() {
        Task task = Task.builder()
                .title("Valid Task")
                .status("invalid-status") // Invalid status - should fail
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertFalse(violations.isEmpty());
        assertEquals("Status must be one of: pending, in-progress, completed", violations.iterator().next().getMessage());
    }

    @Test
    void testDescriptionLengthValidation() {
        String longDescription = "a".repeat(1001); // Exceeds 1000 characters
        Task task = Task.builder()
                .title("Valid Task")
                .description(longDescription)
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertFalse(violations.isEmpty());
        assertEquals("Description cannot exceed 1000 characters", violations.iterator().next().getMessage());
    }

    @Test
    void testTaskCreationWithFactoryMethod() {
        LocalDateTime dueDate = LocalDateTime.now().plusDays(1);
        Task task = Task.create("Test Task", "Test Description", dueDate);

        assertNotNull(task);
        assertEquals("Test Task", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertEquals("pending", task.getStatus()); // Default value
        assertEquals(dueDate, task.getDueDate());
    }

    @Test
    void testLombokFunctionality() {
        Task task = new Task();
        task.setTitle("Test Title");
        task.setDescription("Test Description");
        task.setStatus("completed");
        
        assertNotNull(task.toString());
        assertEquals("Test Title", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertEquals("completed", task.getStatus());
    }
}