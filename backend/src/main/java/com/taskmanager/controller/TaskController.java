package com.taskmanager.controller;

import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("v1/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Tasks", description = "Task management APIs")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Operation(
            summary = "Get all tasks",
            description = "Retrieve a list of all tasks in the system"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved tasks",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Task.class, type = "array"))
    )
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Operation(
            summary = "Get task by ID",
            description = "Retrieve a specific task by its unique identifier"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })


    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(
            @Parameter(description = "UUID of the task to be retrieved", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return ResponseEntity.ok(task);
    }

    @Operation(
            summary = "Create a new task",
            description = "Create a new task with validation. Title and due date are required fields."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Task created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data",
                    content = @Content
            )
    })


    @PostMapping
    public ResponseEntity<Task> createTask(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Task object to be created",
                    required = true,
                    content = @Content(schema = @Schema(implementation = Task.class))
            )
            @Valid @RequestBody Task task) {
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(201).body(savedTask);
    }

    @Operation(
            summary = "Update entire task",
            description = "Update all fields of an existing task"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })


    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @Parameter(description = "UUID of the task to be updated", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Updated task object",
                    required = true,
                    content = @Content(schema = @Schema(implementation = Task.class))
            )
            @Valid @RequestBody Task taskDetails) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(
            summary = "Update task status",
            description = "Update only the status of a task. Valid status values: pending, in-progress, completed"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Status updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid status value",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })


    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @Parameter(description = "UUID of the task to be updated", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id,
            @Parameter(description = "New status value", example = "completed",
                    schema = @Schema(allowableValues = {"pending", "in-progress", "completed"}))
            @RequestParam String status) {

        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status value. Must be one of: pending, in-progress, completed");
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(
            summary = "Delete a task",
            description = "Delete a specific task by its UUID"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task deleted successfully",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @Parameter(description = "UUID of the task to be deleted", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskRepository.delete(task);
        return ResponseEntity.ok().build();
    }

    private boolean isValidStatus(String status) {
        return status != null &&
                (status.equals("pending") || status.equals("in-progress") || status.equals("completed"));
    }
}