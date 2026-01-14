package com.inventory.dto;
import java.time.LocalDateTime;

public class ApiResponse {
    private int status;
    private String message;
    private Object data;
    private LocalDateTime timestamp;

    public ApiResponse() {}

    public ApiResponse(int status, String message, Object data, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }
    
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(200, message, data, LocalDateTime.now());
    }
    
    public static ApiResponse error(int status, String message) {
        return new ApiResponse(status, message, null, LocalDateTime.now());
    }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
