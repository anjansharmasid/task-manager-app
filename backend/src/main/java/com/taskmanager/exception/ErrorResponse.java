

package com.taskmanager.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standard error response format")
public class ErrorResponse {

    @Schema(description = "Timestamp when the error occurred", example = "2023-12-16T10:30:00.123456")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Error type", example = "Validation Failed")
    private String error;

    @Schema(description = "Error message", example = "One or more fields have validation errors")
    private String message;

    @Schema(description = "API path where error occurred", example = "/api/tasks")
    private String path;

    @Schema(description = "List of field validation errors")
    private List<FieldError> fieldErrors;

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Field-level validation error")
    public static class FieldError {

        @Schema(description = "Name of the field with error", example = "title")
        private String field;

        @Schema(description = "Error message", example = "Title is required")
        private String message;

        @Schema(description = "Rejected value", example = "")
        private Object rejectedValue;
    }
}
