package com.taskmanager.controller;

import com.taskmanager.exception.ResourceNotFoundExceptionTest;
import com.taskmanager.model.TaskTest;
import com.taskmanager.repository.TaskRepositoryTest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    
    @Autowired
    private TaskRepositoryTest taskRepository;
    
    // Get all tasks
    @GetMapping
    public List<TaskTest> getAllTasks() {
        return taskRepository.findAll();
    }
    
    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskTest> getTaskById(@PathVariable UUID id) {
        TaskTest task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExceptionTest("Task", "id", id));
        return ResponseEntity.ok(task);
    }
    
    // Create a new task
    @PostMapping
    public ResponseEntity<TaskTest> createTask(@Valid @RequestBody TaskTest task) {
        TaskTest savedTask = taskRepository.save(task);
        return ResponseEntity.status(201).body(savedTask);
    }
    
    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<TaskTest> updateTask(
            @PathVariable UUID id, 
            @Valid @RequestBody TaskTest taskDetails) {
        
        TaskTest task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExceptionTest("Task", "id", id));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());
        
        TaskTest updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }
    
    // Update task status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskTest> updateTaskStatus(
            @PathVariable UUID id, 
            @RequestParam String status) {
        
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status value. Must be one of: pending, in-progress, completed");
        }
        
        TaskTest task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExceptionTest("Task", "id", id));
        
        task.setStatus(status);
        TaskTest updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }
    
    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable UUID id) {
        TaskTest task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExceptionTest("Task", "id", id));
        
        taskRepository.delete(task);
        return ResponseEntity.ok().build();
    }
    
    private boolean isValidStatus(String status) {
        return status != null && 
               (status.equals("pending") || status.equals("in-progress") || status.equals("completed"));
    }
}