
package com.taskmanager.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Schema(description = "Task entity representing a task in the system")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Schema(description = "Unique identifier of the task", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @NotBlank(message = "Title is required and cannot be empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Column(nullable = false, length = 100)
    @Schema(description = "Title of the task", example = "Complete project documentation", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    @Schema(description = "Detailed description of the task", example = "Write comprehensive API documentation for the task manager", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(pending|in-progress|completed)$",
            message = "Status must be one of: pending, in-progress, completed")
    @Column(nullable = false, length = 20)
    @Schema(description = "Current status of the task", example = "in-progress", allowableValues = {"pending", "in-progress", "completed"}, requiredMode = Schema.RequiredMode.REQUIRED)
    @Builder.Default
    private String status = "pending";

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    @Column(nullable = false)
    @Schema(description = "Due date and time of the task", example = "2023-12-31T23:59:59", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDateTime dueDate;

    @Column(updatable = false)
    @Schema(description = "Timestamp when the task was created", example = "2023-12-01T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the task was last updated", example = "2023-12-15T14:22:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;

    // Pre-persist and pre-update methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Custom builder method for easier object creation
    public static Task create(String title, String description, LocalDateTime dueDate) {
        return Task.builder()
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .build();
    }
}
