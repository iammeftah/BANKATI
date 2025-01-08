package com.example.notification_service.dto;

public class NotificationRequest {
    private String userId;
    private String email;
    private String message;

    public NotificationRequest() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public NotificationRequest(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    // Getters et Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
