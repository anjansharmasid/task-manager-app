package com.taskmanager.model;

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
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank(message = "Title is required and cannot be empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Column(nullable = false, length = 100)
    private String title;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(pending|in-progress|completed)$", 
             message = "Status must be one of: pending, in-progress, completed")
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";
    
    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    @Column(nullable = false)
    private LocalDateTime dueDate;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
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