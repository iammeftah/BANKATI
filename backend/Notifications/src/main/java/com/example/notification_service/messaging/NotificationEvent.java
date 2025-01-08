package com.example.notification_service.messaging;

public class NotificationEvent {
    private String userId;
    private String message;

    public NotificationEvent() {}

    public NotificationEvent(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }

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

    @Override
    public String toString() {
        return "NotificationEvent{" +
                "userId='" + userId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
