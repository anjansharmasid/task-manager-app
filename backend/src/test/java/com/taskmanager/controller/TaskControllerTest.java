package com.taskmanager.controller;

import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.TaskRepositoryTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskController taskController;

    @Test
    void testGetAllTasks() {
        // Given
        Task task1 = Task.builder()
                .id(UUID.randomUUID())
                .title("Task 1")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task task2 = Task.builder()
                .id(UUID.randomUUID())
                .title("Task 2")
                .dueDate(LocalDateTime.now().plusDays(2))
                .build();
        
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        // When
        List<Task> tasks = taskController.getAllTasks();

        // Then
        assertEquals(2, tasks.size());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void testGetTaskByIdFound() {
        // Given
        UUID taskId = UUID.randomUUID();
        Task task = Task.builder()
                .id(taskId)
                .title("Test Task")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        // When
        ResponseEntity<Task> response = taskController.getTaskById(taskId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Task", response.getBody().getTitle());
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    void testGetTaskByIdNotFound() {
        // Given
        UUID taskId = UUID.randomUUID();
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            taskController.getTaskById(taskId);
        });
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    void testCreateTask() {
        // Given
        Task newTask = Task.builder()
                .title("New Task")
                .description("New Description")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task savedTask = Task.builder()
                .id(UUID.randomUUID())
                .title("New Task")
                .description("New Description")
                .dueDate(newTask.getDueDate())
                .build();
        
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // When
        ResponseEntity<Task> response = taskController.createTask(newTask);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals("New Task", response.getBody().getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testUpdateTask() {
        // Given
        UUID taskId = UUID.randomUUID();
        Task existingTask = Task.builder()
                .id(taskId)
                .title("Old Title")
                .description("Old Description")
                .status("pending")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task updatedTaskDetails = Task.builder()
                .title("New Title")
                .description("New Description")
                .status("completed")
                .dueDate(LocalDateTime.now().plusDays(2))
                .build();
        
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        // When
        ResponseEntity<Task> response = taskController.updateTask(taskId, updatedTaskDetails);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testUpdateTaskStatus() {
        // Given
        UUID taskId = UUID.randomUUID();
        Task existingTask = Task.builder()
                .id(taskId)
                .title("Test Task")
                .status("pending")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        // When
        ResponseEntity<Task> response = taskController.updateTaskStatus(taskId, "completed");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("completed", existingTask.getStatus());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testDeleteTask() {
        // Given
        UUID taskId = UUID.randomUUID();
        Task existingTask = Task.builder()
                .id(taskId)
                .title("To be deleted")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        doNothing().when(taskRepository).delete(any(Task.class));

        // When
        ResponseEntity<?> response = taskController.deleteTask(taskId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).delete(any(Task.class));
    }
}