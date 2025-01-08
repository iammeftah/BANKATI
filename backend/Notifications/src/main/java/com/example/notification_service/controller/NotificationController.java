package com.example.notification_service.controller;

import com.example.notification_service.model.Notification;
import com.example.notification_service.service.NotificationService;
import com.example.notification_service.dto.NotificationRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public Notification createNotification(@RequestBody NotificationRequest request) {
        Notification notification = new Notification(request.getUserId(), request.getEmail(), request.getMessage());
        return notificationService.saveNotification(notification);
    }

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }
}